using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ParcelExtensions static class, provides extension methods for parcels.
    /// </summary>
    public static class ParcelExtensions
    {
        /// <summary>
        /// Make a query to determine if the parcel PID and PIN are unique.
        /// - No two parcels should have the same PID (exception below)
        /// - No two parcels should have the same PIN
        /// - A Crown Land parcel without a Title will have a PID=0 and a unique PIN.
        /// </summary>
        /// <param name="parcels"></param>
        /// <param name="parcel"></param>
        /// <exception type="DbUpdateException">The PID and PIN must be unique.</exception>
        public static void ThrowIfNotUnique(this DbSet<Entity.Parcel> parcels, Entity.Parcel parcel)
        {
            if(parcel.PropertyTypeId == (int)Entity.PropertyTypes.Subdivision)
            {
                return;
            }
            var alreadyExists = parcels.Any(p => p.Id != parcel.Id && ((parcel.PID > 0 && p.PID == parcel.PID) || (parcel.PIN != null && p.PIN == parcel.PIN)));
            if (alreadyExists) throw new DbUpdateException("PID and PIN values must be unique.");
        }

        /// <summary>
        /// Generate a query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static IQueryable<Entity.Parcel> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.ParcelFilter filter)
        {
            filter.ThrowIfNull(nameof(user));
            filter.ThrowIfNull(nameof(filter));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = user.GetAgenciesAsNullable();
            var viewSensitive = user.HasPermission(Permissions.SensitiveView);
            var isAdmin = user.HasPermission(Permissions.AdminProperties);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Parcels.Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals).AsNoTracking();

            if (!isAdmin)
            {
                query = query.Where(p =>
                    p.IsVisibleToOtherAgencies
                    || ((!p.IsSensitive || viewSensitive)
                        && userAgencies.Contains(p.AgencyId)));
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
            if (!String.IsNullOrWhiteSpace(filter.PID))
            {
                var pidValue = filter.PID.Replace("-", "").Trim();
                if (Int32.TryParse(pidValue, out int pid))
                    query = query.Include(p => p.Buildings)
                        .Include(p => p.CreatedBy)
                        .Include(p => p.UpdatedBy)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Evaluations)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Fiscals)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Classification)
                        .Include(p => p.Parcels).ThenInclude(pp => pp.Parcel)
                        .Include(p => p.Subdivisions).ThenInclude(pp => pp.Subdivision)
                        .Include(p => p.Projects).ThenInclude(pp => pp.Project).ThenInclude(p => p.Workflow).Where(p => p.PID == pid || p.PIN == pid);
            }
            if (!String.IsNullOrWhiteSpace(filter.PIN))
            {
                var pinValue = filter.PIN.Trim();
                if (Int32.TryParse(pinValue, out int pin))
                    query = query.Include(p => p.Buildings)
                        .Include(p => p.CreatedBy)
                        .Include(p => p.UpdatedBy)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Evaluations)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Fiscals)
                        .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Classification)
                        .Include(p => p.Parcels).ThenInclude(pp => pp.Parcel)
                        .Include(p => p.Subdivisions).ThenInclude(pp => pp.Subdivision)
                        .Include(p => p.Projects).ThenInclude(pp => pp.Project).ThenInclude(p => p.Workflow).Where(p => p.PIN == pin);
            }
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => p.ProjectNumbers.Contains(filter.ProjectNumber));
            if (!String.IsNullOrWhiteSpace(filter.Description))
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{filter.Description}%"));
            if (!String.IsNullOrWhiteSpace(filter.AdministrativeArea))
                query = query.Where(p => EF.Functions.Like(p.Address.AdministrativeArea, $"%{filter.AdministrativeArea}%"));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(p => EF.Functions.Like(p.Zoning, $"%{filter.Zoning}%"));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(p => EF.Functions.Like(p.ZoningPotential, $"%{filter.ZoningPotential}%"));

            // TODO: Parse the address information by City, Postal, etc.
            if (!String.IsNullOrWhiteSpace(filter.Address))
                query = query.Where(p => EF.Functions.Like(p.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(p.Address.AdministrativeArea, $"%{filter.Address}%"));

            if (filter.MinLandArea.HasValue)
                query = query.Where(p => p.LandArea >= filter.MinLandArea);
            if (filter.MaxLandArea.HasValue)
                query = query.Where(p => p.LandArea <= filter.MaxLandArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinMarketValue.HasValue)
                query = query.Where(p =>
                    filter.MinMarketValue <= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.FiscalKeys.Market)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxMarketValue.HasValue)
                query = query.Where(p =>
                    filter.MaxMarketValue >= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.FiscalKeys.Market)
                            .Max(pe => pe.FiscalYear))
                        .Value);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MinAssessedValue <= p.Evaluations
                        .FirstOrDefault(e => e.Date == context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);
            if (filter.MaxAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxAssessedValue >= p.Evaluations
                        .FirstOrDefault(e => e.Date == context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderBy(p => p.Id);

            return query;
        }

        /// <summary>
        /// Get a parcel id
        /// </summary>
        /// <param name="parcel"></param>
        /// <returns></returns>
        public static int? GetId(this Entity.Parcel parcel)
        {
            return parcel?.Id;
        }

        /// <summary>
        /// Get unique a pin that will uniquely identify a parcel using a pre-existing pid.
        /// </summary>
        /// <param name="existingPid"></param>
        /// <returns></returns>
        public static int GetUniquePidPin(this PimsContext context, int existingPid)
        {
            // by getting the parcel with the "largest" pin, we can be sure that incrementing this PIN by one will result in a unique PIN (and therefore a unique PID/PIN).
            var matchingParcel = context.Parcels.Where(p => p.PID == existingPid).AsNoTracking().OrderByDescending(p => p.PIN == null ? 0 : p.PIN).FirstOrDefault();
            return (int)(matchingParcel?.PIN == null ? 1 : ++matchingParcel.PIN);

        }

        /// <summary>
        /// Update parcel financials
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="parcelEvaluations"></param>
        /// <param name="parcelFiscals"></param>
        public static void UpdateParcelFinancials(this PimsContext context,  Entity.Parcel parcel,
            ICollection<Entity.ParcelEvaluation> parcelEvaluations, ICollection<Entity.ParcelFiscal> parcelFiscals)
        {
            foreach (var parcelEvaluation in parcelEvaluations)
            {
                var originalEvaluation = parcel.Evaluations
                    .FirstOrDefault(e => e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key);

                if (originalEvaluation == null)
                {
                    parcel.Evaluations.Add(parcelEvaluation);
                }
                else
                {
                    originalEvaluation.Note = parcelEvaluation.Note;
                    originalEvaluation.Value = parcelEvaluation.Value;
                    originalEvaluation.Firm = parcelEvaluation.Firm;
                }
            }

            foreach (var parcelFiscal in parcelFiscals)
            {
                var originalParcelFiscal = parcel.Fiscals
                    .FirstOrDefault(e => e.FiscalYear == parcelFiscal.FiscalYear && e.Key == parcelFiscal.Key);

                if (originalParcelFiscal == null)
                {
                    parcel.Fiscals.Add(parcelFiscal);
                }
                else
                {
                    originalParcelFiscal.Note = parcelFiscal.Note;
                    originalParcelFiscal.Value = parcelFiscal.Value;
                    originalParcelFiscal.EffectiveDate = parcelFiscal.EffectiveDate;
                }
            }
        }
    }
}
