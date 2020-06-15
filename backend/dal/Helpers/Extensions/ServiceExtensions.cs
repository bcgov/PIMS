using Microsoft.EntityFrameworkCore;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ServiceExtensions static class, provides extension methods for services.
    /// </summary>
    public static class ServiceExtensions
    {
        #region Variables
        public static readonly string[] EDITABLE_STATUS_CODES = new[] { "DR", "DR-P", "DR-I", "DR-D", "DR-A" };
        #endregion

        /// <summary>
        /// A parcel can only be updated or removed if not within an active project or user has admin-properties permission
        /// </summary>
        /// <param name="service"></param>
        /// <param name="parcel"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Parcel parcel)
        {
            if (parcel.ProjectNumber != null)
            {
                var project = service.GetContext().Projects
                    .Include(p => p.Status)
                    .FirstOrDefault(p => p.ProjectNumber == parcel.ProjectNumber);
                if (project != null && !service.GetUser().HasPermission(Permissions.AdminProperties) && !EDITABLE_STATUS_CODES.Contains(project.Status.Code))
                {
                    throw new NotAuthorizedException("Cannot update or delete a parcel that is within an active project.");
                }
            }
        }

        /// <summary>
        /// A building can only be updated or removed if not within an active project or user has admin-properties permission
        /// </summary>
        /// <param name="service"></param>
        /// <param name="building"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Building building)
        {
            var context = service.GetContext();
            bool changed() => context.Entry(building).State == EntityState.Modified ||
                            context.Entry(building).State == EntityState.Deleted;
            if (building.ProjectNumber != null && changed())
            {
                var project = context.Projects
                    .Include(p => p.Status)
                    .FirstOrDefault(p => p.ProjectNumber == building.ProjectNumber);
                if (project != null && !service.GetUser().HasPermission(Permissions.AdminProperties) && !EDITABLE_STATUS_CODES.Contains(project.Status.Code))
                {
                    throw new NotAuthorizedException("Cannot update or delete a building that is within an active project.");
                }
            }
        }

        /// <summary>
        /// A parcel can only be updated or removed if not within an active project or user has admin-properties permission
        /// </summary>
        /// <param name="service"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Project project)
        {
            if (project != null && !service.GetUser().HasPermission(Permissions.AdminProjects) && !EDITABLE_STATUS_CODES.Contains(project.Status.Code))
            {
                throw new NotAuthorizedException("Cannot update or delete an active project.");
            }
        }
    }
}
