using Microsoft.AspNetCore.Authentication;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Authorization
{
    /// <summary>
    /// KeycloakClaimTransformer class, provides a way to extract keycloak claims and convert them into role claims.
    /// </summary>
    public class KeycloakClaimTransformer : IClaimsTransformation
    {
        #region Variables
        private const string REALM_ACCESS = "realm_access";

        private readonly JsonSerializerOptions _options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };
        #endregion

        #region Methods
        /// <summary>
        /// Transform the specified ClaimsPrincipal by extracting claim details from keycloak and creating new claims.
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            // Parse the KeyCloak Claims to apply roles.
            if (principal.HasClaim(c => c.Type == REALM_ACCESS))
            {
                var realm_access_claim = principal.Claims.First(c => c.Type == REALM_ACCESS);
                var value = realm_access_claim.Value.Replace("\\", "");
                var realm_access = JsonSerializer.Deserialize<RealmAccess>(value, _options);
                var identity = ((ClaimsIdentity)principal.Identity);
                foreach (var role in realm_access.Roles)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
                }
            }

            // var transformed = new ClaimsPrincipal ();
            // transformed.AddIdentities (principal.Identities);
            // transformed.AddIdentity (new ClaimsIdentity (new Claim[] {
            //     new Claim ("Role", "Administrator")
            // }));
            // return Task.FromResult (transformed);
            return Task.FromResult(principal);
        }
        #endregion
    }

    /// <summary>
    /// RealmAccess private class, provides a way to deserialize the realm access.
    /// </summary>
    class RealmAccess
    {
        public string[] Roles { get; set; }
    }
}
