using Microsoft.EntityFrameworkCore;
using Pims.Dal.Exceptions;
using Pims.Dal.Services;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ServiceExtensions static class, provides extension methods for services.
    /// </summary>
    public static class ServiceExtensions
    {
        /// <summary>
        /// A parcel can only be updated or removed if not within an active project or user has admin-properties permission
        /// </summary>
        /// <param name="service"></param>
        /// <param name="parcel"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Parcel parcel, ProjectOptions options)
        {
            if (parcel.ProjectNumbers != null)
            {
                var project = service.GetContext().Projects
                    .Include(p => p.Workflow)
                    .FirstOrDefault(p => parcel.ProjectNumbers.Contains(p.ProjectNumber));
                if (project != null && !project.IsProjectEditable(service.GetUser(), options))
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
        /// <param name="options"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Building building, ProjectOptions options)
        {
            var context = service.GetContext();
            bool changed() => context.Entry(building).State == EntityState.Modified ||
                            context.Entry(building).State == EntityState.Deleted;
            if (building.ProjectNumbers != null && changed())
            {
                var project = context.Projects
                    .Include(p => p.Workflow)
                    .FirstOrDefault(p => building.ProjectNumbers.Contains(p.ProjectNumber));
                if (project != null && !project.IsProjectEditable(service.GetUser(), options))
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
        /// <param name="options"></param>
        /// <returns></returns>
        public static void ThrowIfNotAllowedToUpdate(this BaseService service, Entity.Project project, ProjectOptions options)
        {
            if (project != null && !project.IsProjectEditable(service.GetUser(), options))
            {
                throw new NotAuthorizedException("Cannot update or delete an active project.");
            }
        }

        /// <summary>
        /// A parcel can only be updated or removed if not within an active project or user has admin-properties permission
        /// </summary>
        /// <param name="service"></param>
        /// <param name="project"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static bool IsAllowedToUpdate(this BaseService service, Entity.Project project, ProjectOptions options)
        {
            return project != null && project.IsProjectEditable(service.GetUser(), options);
        }
    }
}
