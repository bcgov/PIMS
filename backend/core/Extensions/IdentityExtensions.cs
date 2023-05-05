using System;
using System.Linq;
using System.Security.Claims;

namespace Pims.Core.Extensions
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
        public static Guid GetGuid(this ClaimsPrincipal user)
        {
            string sub = user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier)?.Value?.ToString();
            string guid = sub.Split("@")[0];

            return String.IsNullOrWhiteSpace(guid) ? Guid.Empty : new Guid(guid);
        }

        /// <summary>
        /// Get the user's username.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>String username</returns>
        public static string GetUsername(this ClaimsPrincipal user)
        {
            // The BCeID and IDIR JWTs have different property names for some values, we must first get the identity provider
            string identity_provider = user.GetIdentityProvider();
            // Get the username by using the correct field name, dependent on the identity_provider
            // TODO: Make an enum/array of identity providers to keep it D.R.Y.
            if (identity_provider == "idir")
            {
                string value = user.Claims.First(c => c.Type == "idir_username")?.Value.ToString().ToLower() + "@idir";
                return value;
            }
            else if (identity_provider == "bceidbusiness" || identity_provider == "bceidboth")
            {
                string value = user.Claims.First(c => c.Type == "bceid_username")?.Value.ToString().ToLower() + "@bceid";
                return value;
            }
            else if (identity_provider == "unit_testing")
            {
                string value = user.Claims.First(c => c.Type == "test_username")?.Value.ToString().ToLower();
                return value;
            }
            return "";
        }

        /// <summary>
        /// Get the user's preferred username. 
        /// Preferred username is a Keycloak Gold claim which contains the user's GUID followed by @ + the identity provider they used.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>String preferred_username</returns>
        public static string GetPreferredUsername(this ClaimsPrincipal user)
        {
            return user.Claims.First(c => c.Type == "preferred_username").Value;
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
        /// Get the identity provider from the given user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetIdentityProvider(this ClaimsPrincipal user)
        {
            string identity_provider = user.Claims.First(c => c.Type == "identity_provider")?.Value.ToString();
            return identity_provider;
        }
    }
}
