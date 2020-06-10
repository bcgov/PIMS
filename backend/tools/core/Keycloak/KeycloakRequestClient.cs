using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Tools.Core.Keycloak.Configuration;
using Pims.Tools.Core.OpenIdConnect;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;

namespace Pims.Tools.Core.Keycloak
{
    /// <summary>
    /// KeycloakRequestClient class, provides a way to make HTTP requests, handle errors and handle refresh tokens.
    /// </summary>
    public class KeycloakRequestClient : RequestClient, IKeycloakRequestClient
    {
        #region Variables
        private readonly KeycloakRequestOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an KeycloakRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="auth"></param>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="logger"></param>
        public KeycloakRequestClient(IOptionsMonitor<KeycloakRequestOptions> options, IOpenIdConnector auth, IHttpClientFactory clientFactory, JwtSecurityTokenHandler tokenHandler, ILogger<RequestClient> logger)
            : base(options, auth, clientFactory, tokenHandler, logger)
        {
            _options = options.CurrentValue;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Returns the full URI for the Keycloak admin API.
        /// </summary>
        /// <param name="route"></param>
        /// <returns></returns>
        public string AdminRoute(string route)
        {
            return $"{_options.Keycloak.Admin.Authority}/{route}";
        }
        #endregion
    }
}
