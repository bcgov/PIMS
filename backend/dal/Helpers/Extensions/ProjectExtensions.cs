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
    /// ProjectExtensions static class, provides extension methods for projects.
    /// </summary>
    public static class ProjectExtensions
    {
        /// <summary>
        /// Generate a query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static IQueryable<Entity.Project> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.ProjectFilter filter)
        {
            filter.ThrowIfNull(nameof(user));
            filter.ThrowIfNull(nameof(filter));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = user.GetAgencies();
            var viewSensitive = user.HasPermission(Permissions.SensitiveView);
            var isAdmin = user.HasPermission(Permissions.AdminProperties);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Projects
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking();

            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"%{filter.ProjectNumber}%"));
            if (!String.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(p => EF.Functions.Like(p.Name, $"%{filter.Name}%"));
            if (filter.StatusId.HasValue)
                query = query.Where(p => p.StatusId == filter.StatusId);
            if (filter.TierLevelId.HasValue)
                query = query.Where(p => p.TierLevelId == filter.TierLevelId);

            if (filter.Agencies?.Any() == true)
            {
                // Get list of sub-agencies for any agency selected in the filter.
                var agencies = filter.Agencies.Concat(context.Agencies.AsNoTracking().Where(a => filter.Agencies.Contains(a.Id)).SelectMany(a => a.Children.Select(ac => ac.Id)).ToArray()).Distinct();
                query = query.Where(p => agencies.Contains(p.AgencyId));
            }

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderByDescending(p => p.CreatedOn);

            return query;
        }
    }
}
