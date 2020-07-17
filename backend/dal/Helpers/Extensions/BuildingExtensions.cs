using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using System;
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
        /// Make a query to determine if the building PID and PIN are unique.
        /// - No two buildings should have the same PID (exception below)
        /// - No two buildings should have the same PIN
        /// - A Crown Land building without a Title will have a PID=0 and a unique PIN.
        /// </summary>
        /// <param name="buildings"></param>
        /// <param name="building"></param>
        /// <exception type="DbUpdateException">The PID and PIN must be unique.</exception>
        public static void ThrowIfNotUnique(this DbSet<Entity.Building> buildings, Entity.Building building)
        {
            var alreadyExists = buildings.Any(p => p.Id != building.Id && p.ParcelId == building.ParcelId && p.LocalId == building.LocalId);
            if (alreadyExists) throw new DbUpdateException("Local ID must be unique within a parcel.");
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
                query = query.Where(b =>
                    b.Latitude != 0 &&
                    b.Longitude != 0 &&
                    b.Latitude <= filter.NELatitude &&
                    b.Latitude >= filter.SWLatitude &&
                    b.Longitude <= filter.NELongitude &&
                    b.Longitude >= filter.SWLongitude);

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
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"{filter.ProjectNumber}%"));
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

            if (!String.IsNullOrWhiteSpace(filter.Municipality))
                query = query.Where(p => EF.Functions.Like(p.Parcel.Municipality, $"%{filter.Municipality}%"));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(p => EF.Functions.Like(p.Parcel.Zoning, $"%{filter.Zoning}%"));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(p => EF.Functions.Like(p.Parcel.ZoningPotential, $"%{filter.ZoningPotential}%"));

            if (!String.IsNullOrWhiteSpace(filter.Address)) // TODO: Parse the address information by City, Postal, etc.
                query = query.Where(b => EF.Functions.Like(b.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(b.Address.City.Name, $"%{filter.Address}%"));

            if (filter.MinRentableArea.HasValue)
                query = query.Where(b => b.RentableArea >= filter.MinRentableArea);
            if (filter.MaxRentableArea.HasValue)
                query = query.Where(b => b.RentableArea <= filter.MaxRentableArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinEstimatedValue.HasValue)
                query = query.Where(b =>
                    filter.MinEstimatedValue <= b.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.FiscalKeys.Estimated)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(b =>
                    filter.MaxEstimatedValue >= b.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == b.Id && pe.Key == Entity.FiscalKeys.Estimated)
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
        public static string GetZoning(this Entity.Building building)
        {
            return building.Parcel != null ? building.Parcel.Zoning : "";
        }

        /// <summary>
        /// Get a building zoning potential
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public static string GetZoningPotential(this Entity.Building building)
        {
            return building.Parcel != null ? building.Parcel.ZoningPotential : "";
        }
    }
}
