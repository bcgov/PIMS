using System.Security.Claims;
using System.Threading.Tasks;
using BackendApi.Membership;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BackendApi.Helpers.Authorization
{
    /// <summary>
    /// KeyCloakClaimsFactory class, provides a way to add claims to a user.
    /// </summary>
    public class KeyCloakClaimsFactory : UserClaimsPrincipalFactory<ApplicationUser>
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeyCloakClaimsFactory class.
        /// </summary>
        /// <param name="userManager"></param>
        /// <param name="optionsAccessor"></param>
        /// <returns></returns>
        public KeyCloakClaimsFactory (
            UserManager<ApplicationUser> userManager,
            IOptions<IdentityOptions> optionsAccessor) : base (userManager, optionsAccessor) { }
        #endregion

        #region Methods
        /// <summary>
        /// Creates a ClaimsPrincipal for the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public override Task<ClaimsPrincipal> CreateAsync (ApplicationUser user)
        {
            return base.CreateAsync (user);
        }

        /// <summary>
        /// Generates claims for the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        protected override async Task<ClaimsIdentity> GenerateClaimsAsync (ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync (user);
            identity.AddClaim (new Claim ("ContactName", "test"));
            return identity;
        }
        #endregion
    }
}
