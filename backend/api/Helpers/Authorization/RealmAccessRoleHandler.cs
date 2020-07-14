using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Authorization
{
    /// <summary>
    /// RealmAccessRoleHandler class, provides a way to validate whether the user has a specified role.
    /// </summary>
    public class RealmAccessRoleHandler : AuthorizationHandler<RealmAccessRoleRequirement>
    {
        /// <summary>
        /// Determine if the current user has the specified role.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="requirement"></param>
        /// <returns></returns>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RealmAccessRoleRequirement requirement)
        {
            if (!context.User.HasClaim(c => c.Type == "realm_access"))
            {
                return Task.CompletedTask;
            }

            var claim = context.User.Claims.First(c => c.Type == "realm_access");
            if (claim.Value.Contains($"\"{requirement.Role}\""))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
