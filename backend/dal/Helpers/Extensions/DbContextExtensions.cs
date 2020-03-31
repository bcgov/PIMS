using Microsoft.EntityFrameworkCore;
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
    }
}
