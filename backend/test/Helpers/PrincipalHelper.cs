using System;
using System.Security.Claims;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Api.Test.Helpers
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
        public static ClaimsPrincipal CreateForRole(string role)
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new System.Security.Claims.Claim[]
            {
                new System.Security.Claims.Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new System.Security.Claims.Claim (ClaimTypes.Role, role)
            }, "mock"));

            return user;
        }

        /// <summary>
        /// Create a ClaimsPrincipal for the specified permission.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public static ClaimsPrincipal CreateForPermission(Permissions permission)
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new System.Security.Claims.Claim[]
            {
                new System.Security.Claims.Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new System.Security.Claims.Claim (ClaimTypes.Role, permission.GetName())
            }, "mock"));

            return user;
        }
    }
}
