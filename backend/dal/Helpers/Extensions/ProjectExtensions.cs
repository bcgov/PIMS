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
                .Include(p => p.CreatedBy)
                .Include(p => p.UpdatedBy)
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(p => p.Agency)
                .ThenInclude(a => a.Parent)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(p => p.Parcel)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(p => p.Classification)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(p => p.Fiscals)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .ThenInclude(b => b.Address)
                .ThenInclude(a => a.City)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .ThenInclude(p => p.Address)
                .ThenInclude(a => a.City)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .ThenInclude(p => p.Agency)
                .ThenInclude(a => a.Parent)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .ThenInclude(p => p.Classification)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .ThenInclude(p => p.Fiscals)
                .AsNoTracking();

            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"%{filter.ProjectNumber}%"));
            if (!String.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(p => EF.Functions.Like(p.Name, $"%{filter.Name}%"));
            if (filter.StatusId.HasValue)
                query = query.Where(p => p.StatusId == filter.StatusId);
            if (filter.TierLevelId.HasValue)
                query = query.Where(p => p.TierLevelId == filter.TierLevelId);
            if (filter.CreatedByMe.HasValue && filter.CreatedByMe.Value)
            {
                query = query.Where(p => p.CreatedById.Equals(user.GetUserId()));
            }

            if (filter.Active.HasValue && filter.Active.Value)
            {
                query = query.Where(p => p.Status.IsDenied());
            }

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

        /// Generate a new project number in the database.
        /// NOTE - this saves current changes to the datasource and should be called before other changes.
        /// If the subsequent save to the database fails the project number will be unused and result in an orphan.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static Entity.ProjectNumber GenerateProjectNumber(this PimsContext context)
        {
            var projectNumber = new Entity.ProjectNumber();
            context.ProjectNumbers.Add(projectNumber);
            context.SaveChanges();
            return projectNumber;
        }

        /// <summary>
        /// Generate a new project number in the database.
        /// NOTE - this saves current changes to the datasource and should be called before other changes.
        /// If the subsequent save to the database fails the project number will be unused and result in an orphan.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string GenerateProjectNumber(this PimsContext context, string format)
        {
            var projectNumber = context.GenerateProjectNumber();
            return projectNumber.Generate(format);
        }

        /// <summary>
        /// Generate a formatted project number for a project for the specified `projectNumber`.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string Generate(this Entity.ProjectNumber projectNumber, string format)
        {
            return String.Format(format, projectNumber.Id);
        }

        /// <summary>
        /// Add a parcel(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="parcels"></param>
        /// <returns></returns>
        public static Entity.Project AddProperty(this Entity.Project project, params Entity.Parcel[] parcels)
        {
            parcels.ForEach(p =>
            {
                project.Properties.Add(new Entity.ProjectProperty(project, p));
            });
            return project;
        }

        /// <summary>
        /// Add a building(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="buildings"></param>
        /// <returns></returns>
        public static Entity.Project AddProperty(this Entity.Project project, params Entity.Building[] buildings)
        {
            buildings.ForEach(b =>
            {
                project.Properties.Add(new Entity.ProjectProperty(project, b));
            });
            return project;
        }

        /// <summary>
        /// Add a tasks to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="tasks"></param>
        /// <returns></returns>
        public static Entity.Project AddTask(this Entity.Project project, params Entity.Task[] tasks)
        {
            tasks.ForEach(t =>
            {
                project.Tasks.Add(new Entity.ProjectTask(project, t));
            });
            return project;
        }
    }
}
