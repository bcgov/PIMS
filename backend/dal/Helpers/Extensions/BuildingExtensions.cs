using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// BuildingExtensions static class, provides extension methods for buildings.
    /// </summary>
    public static class BuildingExtensions
    {
        /// <summary>
        /// Make a query to determine if the building names are unique.
        /// - No two buildings should have the same name on a parcel.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="building"></param>
        /// <exception type="DbUpdateException">The name within a parcel should be unique.</exception>
        public static void ThrowIfNotUnique(this PimsContext context, Entity.Parcel parcel, Entity.Building building)
        {
            if (parcel == null || String.IsNullOrEmpty(building.Name))
            {
                return;
            }
            var parcelBuildings = context.Parcels.Where(p => p.Id == parcel.Id).SelectMany(p => p.Buildings).Where(b => b.BuildingId != building.Id).Select(b => b.Building.Name).Distinct().ToArray();
            var alreadyExists = parcelBuildings.Contains(building.Name);
            if (alreadyExists) throw new DbUpdateException("A building name must be unique on the parcel.");
        }

        /// <summary>
        /// Generate a query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static IQueryable<Entity.Building> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.BuildingFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));
            filter.ThrowIfNull(nameof(user));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = user.GetAgenciesAsNullable();
            var viewSensitive = user.HasPermission(Permissions.SensitiveView);
            var isAdmin = user.HasPermission(Permissions.AdminProperties);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Buildings.AsNoTracking();

            if (!isAdmin)
            {
                query = query.Where(b =>
                    b.IsVisibleToOtherAgencies
                    || ((!b.IsSensitive || viewSensitive)
                        && userAgencies.Contains(b.AgencyId)));
            }

            if (filter.NELatitude.HasValue && filter.NELongitude.HasValue && filter.SWLatitude.HasValue && filter.SWLongitude.HasValue)
            {
                var poly = new NetTopologySuite.Geometries.Envelope(filter.NELongitude.Value, filter.SWLongitude.Value, filter.NELatitude.Value, filter.SWLatitude.Value).ToPolygon();
                query = query.Where(p => poly.Contains(p.Location));
            }

            if (filter.Agencies?.Any() == true)
            {
                // Get list of sub-agencies for any agency selected in the filter.
                var filterAgencies = filter.Agencies.Select(a => (int?)a);
                var agencies = filterAgencies.Concat(context.Agencies.AsNoTracking().Where(a => filterAgencies.Contains(a.Id)).SelectMany(a => a.Children.Select(ac => (int?)ac.Id)).ToArray()).Distinct();
                query = query.Where(p => agencies.Contains(p.AgencyId));
            }
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => p.ProjectNumbers.Contains(filter.ProjectNumber));
            if (!String.IsNullOrWhiteSpace(filter.Description))
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{filter.Description}%"));
            if (filter.ConstructionTypeId.HasValue)
                query = query.Where(b => b.BuildingConstructionTypeId == filter.ConstructionTypeId);
            if (filter.PredominateUseId.HasValue)
                query = query.Where(b => b.BuildingPredominateUseId == filter.PredominateUseId);
            if (filter.FloorCount.HasValue)
                query = query.Where(b => b.BuildingFloorCount == filter.FloorCount);
            if (!String.IsNullOrWhiteSpace(filter.Tenancy))
                query = query.Where(b => EF.Functions.Like(b.BuildingTenancy, $"%{filter.Tenancy}%"));

            if (!String.IsNullOrWhiteSpace(filter.AdministrativeArea))
                query = query.Where(b => b.Parcels.Any(p => EF.Functions.Like(p.Parcel.Address.AdministrativeArea, $"%{filter.AdministrativeArea}%")));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(b => b.Parcels.Any(p => EF.Functions.Like(p.Parcel.Zoning, $"%{filter.Zoning}%")));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(b => b.Parcels.Any(p => EF.Functions.Like(p.Parcel.ZoningPotential, $"%{filter.ZoningPotential}%")));

            if (!String.IsNullOrWhiteSpace(filter.Address)) // TODO: Parse the address information by City, Postal, etc.
                query = query.Where(b => EF.Functions.Like(b.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(b.Address.AdministrativeArea, $"%{filter.Address}%"));

            if (filter.MinRentableArea.HasValue)
                query = query.Where(b => b.RentableArea >= filter.MinRentableArea);
            if (filter.MaxRentableArea.HasValue)
                query = query.Where(b => b.RentableArea <= filter.MaxRentableArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinMarketValue.HasValue)
                query = query.Where(b =>
                    filter.MinMarketValue <= b.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.FiscalKeys.Market)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxMarketValue.HasValue)
                query = query.Where(b =>
                    filter.MaxMarketValue >= b.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.FiscalKeys.Market)
                            .Max(pe => pe.FiscalYear))
                        .Value);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinAssessedValue.HasValue)
                query = query.Where(b =>
                    filter.MinAssessedValue <= b.Evaluations
                        .FirstOrDefault(e => e.Date == context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);
            if (filter.MaxAssessedValue.HasValue)
                query = query.Where(b =>
                    filter.MaxAssessedValue >= b.Evaluations
                        .FirstOrDefault(e => e.Date == context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderBy(b => b.Id);

            return query;
        }

        /// <summary>
        /// Get a building zoning
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string[] GetZoning(this Entity.Building building)
        {
            return building.Parcels.Select(p => p.Parcel.Zoning).Where(s => !String.IsNullOrWhiteSpace(s)).ToArray();
        }

        /// <summary>
        /// Get a building zoning potential
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string[] GetZoningPotential(this Entity.Building building)
        {
            return building.Parcels.Select(p => p.Parcel.ZoningPotential).Where(s => !String.IsNullOrWhiteSpace(s)).ToArray();
        }

        /// <summary>
        /// Get the building construction type name.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string GetConstructionType(this Entity.Building building)
        {
            return building.BuildingConstructionType?.Name;
        }

        /// <summary>
        /// Get the building occupant type name.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string GetOccupantType(this Entity.Building building)
        {
            return building.BuildingOccupantType?.Name;
        }

        /// <summary>
        /// Get the building preduminate use name.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string GetPredominateUse(this Entity.Building building)
        {
            return building.BuildingPredominateUse?.Name;
        }

        /// <summary>
        /// Get the first parcel this building is located on.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static int? GetParcelId(this Entity.Building building)
        {
            return building.Parcels.FirstOrDefault()?.ParcelId;
        }

        /// <summary>
        /// Update building financials
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="buildingEvaluations"></param>
        /// <param name="buildingFiscals"></param>
        public static void UpdateBuildingFinancials(this PimsContext context, Entity.Building building,
            ICollection<Entity.BuildingEvaluation> buildingEvaluations, ICollection<Entity.BuildingFiscal> buildingFiscals)
        {

            foreach (var buildingEvaluation in buildingEvaluations)
            {
                var existingEvaluation = building.Evaluations
                    .FirstOrDefault(e => e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key);
                var updateEvaluation = existingEvaluation?.Value != buildingEvaluation.Value;

                if (existingEvaluation == null)
                {
                    building.Evaluations.Add(buildingEvaluation);
                }
                else if (updateEvaluation)
                {
                    context.Entry(existingEvaluation).CurrentValues.SetValues(buildingEvaluation);
                }
            }
            foreach (var buildingFiscal in buildingFiscals)
            {
                var originalBuildingFiscal = building.Fiscals
                    .FirstOrDefault(e => e.FiscalYear == buildingFiscal.FiscalYear && e.Key == buildingFiscal.Key);

                var updateFiscal = originalBuildingFiscal?.Value != buildingFiscal.Value || originalBuildingFiscal?.EffectiveDate != buildingFiscal.EffectiveDate;
                if (originalBuildingFiscal == null)
                {
                    building.Fiscals.Add(buildingFiscal);
                }
                else if (updateFiscal)
                {
                    context.Entry(originalBuildingFiscal).CurrentValues.SetValues(buildingFiscal);
                }
            }
        }
    }
}
