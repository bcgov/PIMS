using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Pims.Api.Models.Membership;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Authorization
{
    /// <summary>
    /// KeycloakClaimsFactory class, provides a way to add claims to a user.
    /// </summary>
    public class KeycloakClaimsFactory : UserClaimsPrincipalFactory<ApplicationUserModel>
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakClaimsFactory class.
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="optionsAccessor"></param>
        /// <returns></returns>
        public KeycloakClaimsFactory(
            UserManager<ApplicationUserModel> userManager,
            IOptions<IdentityOptions> optionsAccessor) : base(userManager, optionsAccessor) { }
        #endregion

        #region Methods
        /// <summary>
        /// Creates a ClaimsPrincipal for the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public override Task<ClaimsPrincipal> CreateAsync(ApplicationUserModel user)
        {
            return base.CreateAsync(user);
        }

        /// <summary>
        /// Generates claims for the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUserModel user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            identity.AddClaim(new Claim("ContactName", "test"));
            return identity;
        }
        #endregion
    }
}
