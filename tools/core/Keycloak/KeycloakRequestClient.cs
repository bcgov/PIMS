using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Http.Configuration;
using Pims.Tools.Core.Configuration;
using Pims.Tools.Core.Keycloak.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text.Json;

namespace Pims.Tools.Core.Keycloak
{
    /// <summary>
    /// KeycloakRequestClient class, provides a way to make HTTP requests, handle errors and handle refresh tokens.
    /// </summary>
    public class KeycloakRequestClient : RequestClient, IKeycloakRequestClient
    {
        #region Variables
        private readonly KeycloakOptions _keycloakOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an KeycloakRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="keycloakOptions"></param>
        /// <param name="openIdConnectOptions"></param>
        /// <param name="requestOptions"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="logger"></param>
        public KeycloakRequestClient(
            IHttpClientFactory clientFactory,
            JwtSecurityTokenHandler tokenHandler,
            IOptionsMonitor<KeycloakOptions> keycloakOptions,
            IOptionsMonitor<OpenIdConnectOptions> openIdConnectOptions,
            IOptionsMonitor<RequestOptions> requestOptions,
            IOptionsMonitor<JsonSerializerOptions> serializerOptions,
            ILogger<RequestClient> logger)
            : base(clientFactory, tokenHandler, keycloakOptions, openIdConnectOptions, requestOptions, serializerOptions, logger)
        {
            _keycloakOptions = keycloakOptions.CurrentValue;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Returns the full URI for the Keycloak admin API.
        /// </summary>
        /// <param name="route"></param>
        /// <returns></returns>
        public string AdminRoute(string route = null)
        {
            return $"{_keycloakOptions.Admin.Authority}{(!String.IsNullOrWhiteSpace(route) ? $"/{route}" : String.Empty)}";
        }
        #endregion
    }
}
