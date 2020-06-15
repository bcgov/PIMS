using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Exceptions;
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
        /// Generate a project query for the specified 'filter'.
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
            var isAdmin = user.HasPermission(Permissions.AdminProjects);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Projects
                .Include(p => p.CreatedBy)
                .Include(p => p.UpdatedBy)
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking();

            if (filter.AccessDisposal.HasValue && filter.AccessDisposal.Value)
            {
                var statuses = context.Workflows.Where(w => w.Code == "ACCESS-DISPOSAL")
                    .SelectMany(w => w.Status).Select(x => x.StatusId).ToArray();
                query = query.Where(p => statuses.Contains(p.StatusId) || p.Status.Code.Equals("AS-I"));
            }

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
                query = query.Where(p => p.Status.IsActive);
            }

            if (filter.Agencies?.Any() == true)
            {
                // Get list of sub-agencies for any agency selected in the filter.
                var agencies = filter.Agencies.Concat(context.Agencies.AsNoTracking().Where(a => filter.Agencies.Contains(a.Id)).SelectMany(a => a.Children.Select(ac => ac.Id)).ToArray()).Distinct();
                query = query.Where(p => agencies.Contains(p.AgencyId));
            }

            // Only admins can view all agency projects.
            if (!isAdmin)
            {
                query = query.Where(p => userAgencies.Contains(p.AgencyId));
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
        /// <param name="properties"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Property[] properties)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var p in properties)
            {
                var pp = new Entity.ProjectProperty(project, p);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Add a parcel(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="parcels"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Parcel[] parcels)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var p in parcels)
            {
                var pp = new Entity.ProjectProperty(project, p);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Add a building(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="buildings"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Building[] buildings)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var b in buildings)
            {
                var pp = new Entity.ProjectProperty(project, b);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Update the property.ProjectNumber with the specified 'projectNumber'.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Property UpdateProjectNumber(this Entity.ProjectProperty property, string projectNumber)
        {
            switch (property.PropertyType)
            {
                case (Entity.PropertyTypes.Land):
                    if (property.Parcel == null) throw new InvalidOperationException("Unable to update parcel project number.");
                    property.Parcel.ProjectNumber = projectNumber;
                    return property.Parcel;
                case (Entity.PropertyTypes.Building):
                    if (property.Building == null) throw new InvalidOperationException("Unable to update building project number.");
                    property.Building.ProjectNumber = projectNumber;
                    return property.Building;
            }

            return null;
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

        /// <summary>
        /// Throw an exception if the passed property is not in the same agency or sub agency as this project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="property"></param>
        /// <returns></returns>
        public static void ThrowIfPropertyNotInProjectAgency(this Entity.Project project, Entity.Property property)
        {
            //properties may be in the same agency or sub-agency of a project. A parcel in a parent agency may not be added to a sub-agency project.
            if (property.AgencyId != project.AgencyId
                && property.Agency?.ParentId != project.AgencyId)
                throw new InvalidOperationException("Properties may not be added to Projects with a different agency.");
        }
    }
}
