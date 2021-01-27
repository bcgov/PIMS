using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// DbContextExtensions static class, provides extension methods for DbContext objects.
    /// </summary>
    public static class DbContextExtensions
    {
        /// <summary>
        /// When manipulating entities it is necessary to reset the original value for 'RowVersion' so that concurrency checking can occur.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="source"></param>
        public static void SetOriginalRowVersion<T>(this DbContext context, T source) where T : BaseEntity
        {
            context.Entry(source).OriginalValues[nameof(BaseEntity.RowVersion)] = source.RowVersion;
        }

        /// <summary>
        /// Detach the entity from the context.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="entity"></param>
        public static void Detach<T>(this DbContext context, T entity) where T : BaseEntity
        {
            context.Entry(entity).State = EntityState.Detached;
        }

        /// <summary>
        /// Update the project number for the specified 'project' with the specified 'projectNumber'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <param name="projectNumber"></param>
        public static void UpdateProjectNumber(this PimsContext context, Project project, string projectNumber)
        {
            var originalProjectNumber = project.ProjectNumber;
            project.ProjectNumber = projectNumber;
            context.Update(project);

            project.Properties.ForEach(p =>
            {
                if (p.PropertyType == PropertyTypes.Land && p.Parcel == null)
                    p.Parcel = context.Parcels.Find(p.ParcelId);
                else if (p.PropertyType == PropertyTypes.Building && p.Building == null)
                    p.Building = context.Buildings.Find(p.BuildingId);

                context.Update(p.UpdateProjectNumbers(projectNumber));
                context.Update(p.RemoveProjectNumber(originalProjectNumber));
            });
        }
    }
}
