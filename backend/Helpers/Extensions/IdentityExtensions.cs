using System;
using System.Security.Claims;

namespace Pims.Api.Helpers.Extensions
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
            return String.IsNullOrWhiteSpace(value) ? Guid.Empty : new Guid(user.FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}
