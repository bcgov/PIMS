using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// PropertyExtensions static class, provides extension methods for propertys.
    /// </summary>
    public static class PropertyExtensions
    {
        /// <summary>
        /// Generate a query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static IQueryable<Entity.Views.Property> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.AllPropertyFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));
            filter.ThrowIfNull(nameof(user));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = user.GetAgencies();
            var viewSensitive = user.HasPermission(Permissions.SensitiveView);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Properties.AsNoTracking().Where(b =>
                !b.IsSensitive || (viewSensitive && userAgencies.Contains(b.AgencyId)));

            if (filter.PropertyType.HasValue)
                query = query.Where(p => p.PropertyTypeId == filter.PropertyType);

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
                var agencies = filter.Agencies.Concat(context.Agencies.AsNoTracking().Where(a => filter.Agencies.Contains(a.Id)).SelectMany(a => a.Children.Select(ac => ac.Id)).ToArray()).Distinct();
                query = query.Where(p => agencies.Contains(p.AgencyId));
            }
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (filter.StatusId.HasValue)
                query = query.Where(p => p.StatusId == filter.StatusId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"{filter.ProjectNumber}%"));
            if (filter.IgnorePropertiesInProjects == true)
                query = query.Where(p => p.ProjectNumber == null);
            if (!String.IsNullOrWhiteSpace(filter.Description))
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{filter.Description}%"));

            if (!String.IsNullOrWhiteSpace(filter.Municipality))
                query = query.Where(p => EF.Functions.Like(p.Municipality, $"%{filter.Municipality}%"));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(p => EF.Functions.Like(p.Zoning, $"%{filter.Zoning}%"));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(p => EF.Functions.Like(p.ZoningPotential, $"%{filter.ZoningPotential}%"));

            if (filter.ConstructionTypeId.HasValue)
                query = query.Where(p => p.BuildingConstructionTypeId == filter.ConstructionTypeId);
            if (filter.PredominateUseId.HasValue)
                query = query.Where(p => p.BuildingPredominateUseId == filter.PredominateUseId);
            if (filter.FloorCount.HasValue)
                query = query.Where(p => p.BuildingFloorCount == filter.FloorCount);
            if (!String.IsNullOrWhiteSpace(filter.Tenancy))
                query = query.Where(p => EF.Functions.Like(p.BuildingTenancy, $"%{filter.Tenancy}%"));

            if (!String.IsNullOrWhiteSpace(filter.Address))
                query = query.Where(p => EF.Functions.Like(p.Address, $"%{filter.Address}%") || EF.Functions.Like(p.City, $"%{filter.Address}%"));

            if (filter.MinLandArea.HasValue)
                query = query.Where(p => p.LandArea >= filter.MinLandArea);
            if (filter.MaxLandArea.HasValue)
                query = query.Where(b => b.LandArea <= filter.MaxLandArea);

            if (filter.MinRentableArea.HasValue)
                query = query.Where(p => p.RentableArea >= filter.MinRentableArea);
            if (filter.MaxRentableArea.HasValue)
                query = query.Where(b => b.RentableArea <= filter.MaxRentableArea);

            if (filter.MinEstimatedValue.HasValue)
                query = query.Where(p => p.Estimated >= filter.MinEstimatedValue);
            if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(p => p.Estimated <= filter.MaxEstimatedValue);

            if (filter.MinAssessedValue.HasValue)
                query = query.Where(p => p.Assessed >= filter.MinAssessedValue);
            if (filter.MaxAssessedValue.HasValue)
                query = query.Where(p => p.Assessed <= filter.MaxAssessedValue);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderBy(b => b.Id);

            return query;
        }
    }
}
