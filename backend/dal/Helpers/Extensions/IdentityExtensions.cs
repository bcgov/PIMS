using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// IdentityExtensions static class, provides extension methods for user identity.
    /// </summary>
    public static class IdentityExtensions
    {
        /// <summary>
        /// Get the currently logged in user's ClaimTypes.NameIdentifier.
        /// Return an empty Guid if no user is logged in.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            return String.IsNullOrWhiteSpace(value) ? Guid.Empty : new Guid(value);
        }

        /// <summary>
        /// Get the user's list of agencies they have access to.
        /// Return 'null' if no agencies are found.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        public static int[] GetAgencies(this ClaimsPrincipal user, string delimiter = ",")
        {
            var agencies = user?.FindAll("agencies");
            var results = new List<int>();

            agencies?.ForEach(c =>
            {
                var split = c.Value.Split(delimiter);
                results.AddRange(split.Select(v => Int32.Parse(v)));
            });

            return results.ToArray();
        }

        /// <summary>
        /// Get the user's list of agencies they have access to.
        /// Return 'null' if no agencies are found.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        public static int?[] GetAgenciesAsNullable(this ClaimsPrincipal user, string delimiter = ",")
        {
            var agencies = user?.FindAll("agencies");
            var results = new List<int?>();

            agencies?.ForEach(c =>
            {
                var split = c.Value.Split(delimiter);
                results.AddRange(split.Select(v => (int?)Int32.Parse(v)));
            });

            return results.ToArray();
        }

        /// <summary>
        /// Get the user's username.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetUsername(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue("username");
            return value;
        }

        /// <summary>
        /// Get the user's display name.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetDisplayName(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue("name");
            return value;
        }

        /// <summary>
        /// Get the user's first name.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetFirstName(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue(ClaimTypes.GivenName);
            return value;
        }

        /// <summary>
        /// Get the user's last name.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetLastName(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue(ClaimTypes.Surname);
            return value;
        }

        /// <summary>
        /// Get the user's email.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetEmail(this ClaimsPrincipal user)
        {
            var value = user?.FindFirstValue(ClaimTypes.Email);
            return value;
        }

        /// <summary>
        /// Determine if the user any of the specified roles.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <returns>True if the user has any of the roles.</returns>
        public static bool HasRole(this ClaimsPrincipal user, params string[] role)
        {
            if (role == null) throw new ArgumentNullException(nameof(role));
            if (role.Length == 0) throw new ArgumentOutOfRangeException(nameof(role));

            return user.Claims.Any(c => c.Type == ClaimTypes.Role && role.Contains(c.Value));
        }

        /// <summary>
        /// Determine if the user all of the specified roles.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <returns>True if the user has all of the roles.</returns>
        public static bool HasRoles(this ClaimsPrincipal user, params string[] role)
        {
            if (role == null) throw new ArgumentNullException(nameof(role));
            if (role.Length == 0) throw new ArgumentOutOfRangeException(nameof(role));

            var count = user.Claims.Count(c => c.Type == ClaimTypes.Role && role.Contains(c.Value));

            return count == role.Length;
        }

        /// <summary>
        /// Determine if the user any of the specified permission.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <returns>True if the user has any of the permission.</returns>
        public static bool HasPermission(this ClaimsPrincipal user, params Permissions[] permission)
        {
            if (permission == null) throw new ArgumentNullException(nameof(permission));
            if (permission.Length == 0) throw new ArgumentOutOfRangeException(nameof(permission));

            var roles = permission.Select(r => r.GetName()).ToArray();
            return user.Claims.Any(c => c.Type == ClaimTypes.Role && roles.Contains(c.Value));
        }

        /// <summary>
        /// Determine if the user all of the specified permissions.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <returns>True if the user has all of the permissions.</returns>
        public static bool HasPermissions(this ClaimsPrincipal user, params Permissions[] permission)
        {
            if (permission == null) throw new ArgumentNullException(nameof(permission));
            if (permission.Length == 0) throw new ArgumentOutOfRangeException(nameof(permission));

            var roles = permission.Select(r => r.GetName()).ToArray();
            return user.Claims.All(c => c.Type == ClaimTypes.Role && roles.Contains(c.Value));
        }

        /// <summary>
        /// If the user does has not been authenticated throw a NotAuthorizedException.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <exception type="NotAuthorizedException">User does not have the specified 'role'.</exception>
        /// <returns></returns>
        public static ClaimsPrincipal ThrowIfNotAuthorized(this ClaimsPrincipal user, string message = null)
        {
            if (user == null || !user.Identity.IsAuthenticated) throw new NotAuthorizedException(message);
            return user;
        }

        /// <summary>
        /// If the user does not have the specified 'role' throw a NotAuthorizedException.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <param name="message"></param>
        /// <exception type="NotAuthorizedException">User does not have the specified 'role'.</exception>
        /// <returns></returns>
        public static ClaimsPrincipal ThrowIfNotAuthorized(this ClaimsPrincipal user, string role, string message)
        {
            if (user == null || !user.HasRole(role)) throw new NotAuthorizedException(message);
            return user;
        }

        /// <summary>
        /// If the user does not have the specified 'permission' throw a NotAuthorizedException.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="message"></param>
        /// <exception type="NotAuthorizedException">User does not have the specified 'permission'.</exception>
        /// <returns></returns>
        public static ClaimsPrincipal ThrowIfNotAuthorized(this ClaimsPrincipal user, Permissions permission, string message = null)
        {
            if (user == null || !user.HasPermission(permission)) throw new NotAuthorizedException(message);
            return user;
        }

        /// <summary>
        /// If the user does not have any of the specified 'permission' throw a NotAuthorizedException.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <exception type="NotAuthorizedException">User does not have the specified 'role'.</exception>
        /// <returns></returns>
        public static ClaimsPrincipal ThrowIfNotAuthorized(this ClaimsPrincipal user, params Permissions[] permission)
        {
            if (user == null || !user.HasPermission(permission)) throw new NotAuthorizedException();
            return user;
        }

        /// <summary>
        /// If the user does not have any of the specified 'permission' throw a NotAuthorizedException.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="message"></param>
        /// <exception type="NotAuthorizedException">User does not have the specified 'role'.</exception>
        /// <returns></returns>
        public static ClaimsPrincipal ThrowIfNotAuthorized(this ClaimsPrincipal user, Permissions[] permission, string message = null)
        {
            if (user == null || !user.HasPermission(permission)) throw new NotAuthorizedException(message);
            return user;
        }

        /// <summary>
        /// Throw exception if the 'user' is not allowed to edit the specified entity.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="paramName"></param>
        /// <param name="entity"></param>
        /// <param name="permission"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">Entity argument cannot be null.</exception>
        /// <exception type="RowVersionMissingException">Entity.RowVersion cannot be null.</exception>
        /// <exception type="NotAuthorizedException">User must have specified 'role'.</exception>
        /// <returns></returns>
        public static T ThrowIfNotAllowedToEdit<T>(this ClaimsPrincipal user, string paramName, T entity, Permissions permission, string message = null) where T : BaseEntity
        {
            entity.ThrowIfNull(paramName);
            entity.ThrowIfRowVersionNull(paramName);
            user.ThrowIfNotAuthorized(permission, message);

            return entity;
        }

        /// <summary>
        /// Throw exception if the 'user' is not allowed to edit the specified entity.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="paramName"></param>
        /// <param name="entity"></param>
        /// <param name="permission"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">Entity argument cannot be null.</exception>
        /// <exception type="RowVersionMissingException">Entity.RowVersion cannot be null.</exception>
        /// <exception type="NotAuthorizedException">User must have specified 'role'.</exception>
        /// <returns></returns>
        public static T ThrowIfNotAllowedToEdit<T>(this ClaimsPrincipal user, string paramName, T entity, Permissions[] permission, string message = null) where T : BaseEntity
        {
            entity.ThrowIfNull(paramName);
            entity.ThrowIfRowVersionNull(paramName);
            user.ThrowIfNotAuthorized(permission, message);

            return entity;
        }

        /// <summary>
        /// A user is supposed to only belong to one child agency or one parent agency.
        /// While in Keycloak these rules can be broken, we have to assume the first parent agency, or the first child agency is the user's primary.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public static Agency GetAgency(this ClaimsPrincipal user, PimsContext context)
        {
            var agencyIds = user.GetAgencies();

            if (agencyIds == null || !agencyIds.Any()) return null;

            var agencies = context.Agencies.Where(a => agencyIds.Contains(a.Id)).OrderBy(a => a.ParentId);

            // If one of the agencies is a parent, return it.
            var parentAgency = agencies.FirstOrDefault(a => a.ParentId == null);
            if (parentAgency != null)
                return parentAgency;

            // Assume the first agency is their primary
            return agencies.FirstOrDefault();
        }
    }
}
