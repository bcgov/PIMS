using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Security;
using System.Security.Claims;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// EntityExtensions static class, provides extensions methods for entities.
    /// </summary>
    public static class EntityExtensions
    {
        /// <summary>
        /// Throw exception if the user is not allowed to edit the specified entity.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="paramName"></param>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">Entity argument cannot be null.</exception>
        /// <exception type="RowVersionMissingException">Entity.RowVersion cannot be null.</exception>
        /// <exception type="NotAuthorizedException">User must have specified 'role'.</exception>
        /// <returns></returns>
        public static T ThrowIfNotAllowedToEdit<T>(this T entity, string paramName, ClaimsPrincipal user, string role, string message = null) where T : BaseEntity
        {
            entity.ThrowIfNull(paramName);
            entity.ThrowIfRowVersionNull(paramName);
            user.ThrowIfNotAuthorized(role, message);

            return entity;
        }

        /// <summary>
        /// Throw exception if the 'user' is not allowed to edit the specified 'entity'.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="paramName"></param>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">Entity argument cannot be null.</exception>
        /// <exception type="RowVersionMissingException">Entity.RowVersion cannot be null.</exception>
        /// <exception type="NotAuthorizedException">User must have specified 'role'.</exception>
        /// <returns></returns>
        public static T ThrowIfNotAllowedToEdit<T>(this T entity, string paramName, ClaimsPrincipal user, Permissions permission, string message = null) where T : BaseEntity
        {
            entity.ThrowIfNull(paramName);
            entity.ThrowIfRowVersionNull(paramName);
            user.ThrowIfNotAuthorized(permission, message);

            return entity;
        }

        /// <summary>
        /// Throw exception if the 'user' is not allowed to edit the specified 'entity'.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="paramName"></param>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="requireAll"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">Entity argument cannot be null.</exception>
        /// <exception type="RowVersionMissingException">Entity.RowVersion cannot be null.</exception>
        /// <exception type="NotAuthorizedException">User must have specified 'role'.</exception>
        /// <returns></returns>
        public static T ThrowIfNotAllowedToEdit<T>(this T entity, string paramName, ClaimsPrincipal user, Permissions[] permission, bool requireAll = false, string message = null) where T : BaseEntity
        {
            entity.ThrowIfNull(paramName);
            entity.ThrowIfRowVersionNull(paramName);
            if (requireAll) user.ThrowIfNotAllAuthorized(permission);
            else user.ThrowIfNotAuthorized(permission, message);

            return entity;
        }

        /// <summary>
        /// When manipulating entities it is necessary to reset the original value for 'RowVersion' so that concurrency checking can occur.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="context"></param>
        public static void SetOriginalRowVersion<T>(this T source, DbContext context) where T : BaseEntity
        {
            context.SetOriginalRowVersion(source);
        }
    }
}
