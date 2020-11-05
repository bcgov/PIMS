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
            var query = context.Parcels.AsNoTracking();

            if (!isAdmin)
            {
                query = query.Where(p =>
                    p.IsVisibleToOtherAgencies
                    || ((!p.IsSensitive || viewSensitive)
                        && userAgencies.Contains(p.AgencyId)));
            }

            if (filter.NELatitude.HasValue && filter.NELongitude.HasValue && filter.SWLatitude.HasValue && filter.SWLongitude.HasValue)
            {
                var pfactory = new NetTopologySuite.Geometries.GeometryFactory();
                var ring = new NetTopologySuite.Geometries.LinearRing(
                    new[] {
                        new NetTopologySuite.Geometries.Coordinate(filter.NELongitude.Value, filter.NELatitude.Value),
                        new NetTopologySuite.Geometries.Coordinate(filter.SWLongitude.Value, filter.NELatitude.Value),
                        new NetTopologySuite.Geometries.Coordinate(filter.SWLongitude.Value, filter.SWLatitude.Value),
                        new NetTopologySuite.Geometries.Coordinate(filter.NELongitude.Value, filter.SWLatitude.Value),
                        new NetTopologySuite.Geometries.Coordinate(filter.NELongitude.Value, filter.NELatitude.Value)
                    });
                var poly = pfactory.CreatePolygon(ring);
                poly.SRID = 4326;
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
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"{filter.ProjectNumber}%"));
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
            if (filter.MinEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MinEstimatedValue <= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.FiscalKeys.Estimated)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxEstimatedValue >= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && pe.Key == Entity.FiscalKeys.Estimated)
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
    }
}
