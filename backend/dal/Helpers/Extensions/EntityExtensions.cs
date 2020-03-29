using System.Security.Claims;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;

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
        /// Throw exception if the user is not allowed to edit the specified entity.
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
    }
}
