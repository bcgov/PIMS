using System;
using System.Collections.Generic;
using System.Security.Claims;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Core.Test
{
    /// <summary>
    /// Principal static class, provides helper functions for principal identities.
    /// </summary>
    public static class PrincipalHelper
    {
        /// <summary>
        /// Create a ClaimsPrincipal for the specified role.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public static ClaimsPrincipal CreateForRole(params string[] role)
        {
            role ??= new string[0];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
            };

            foreach (var claim in role)
            {
                claims.Add(new Claim(ClaimTypes.Role, claim ?? "none"));
            }
            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));

            return user;
        }

        /// <summary>
        /// Create a ClaimsPrincipal for the specified permission.
        /// </summary>
        /// <param name="permission"></param>
        /// <returns></returns>
        public static ClaimsPrincipal CreateForPermission(params Permissions[] permission)
        {
            permission ??= new Permissions[0];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
            };

            foreach (var claim in permission)
            {
                claims.Add(new Claim(ClaimTypes.Role, claim.GetName()));
            }
            var user = new ClaimsPrincipal(new ClaimsIdentity(claims, "mock"));

            return user;
        }

        /// <summary>
        /// Add a claim to the specified 'user'.
        /// This will create a new user that has the claim.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="type"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static ClaimsPrincipal AddClaim(this ClaimsPrincipal user, string type, string value)
        {
            var identity = new ClaimsIdentity(user.Identity);
            identity.AddClaim(new Claim(type, value));

            return new ClaimsPrincipal(identity);
        }

        /// <summary>
        /// Add the claim 'agencies' to the specified 'user'.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static ClaimsPrincipal AddAgency(this ClaimsPrincipal user, params int[] agencyId)
        {
            var agencies = String.Join(",", agencyId);
            return user.AddClaim("agencies", agencies);
        }
    }
}
