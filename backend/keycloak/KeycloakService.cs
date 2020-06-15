using Microsoft.Extensions.Options;
using Pims.Core.Http;

namespace Pims.Keycloak
{
    /// <summary>
    /// KeycloakService class, provides a service for sending HTTP requests to the keycloak admin API.
    ///     - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_overview
    /// </summary>
    public partial class KeycloakService : IKeycloakService
    {
        #region Variables
        private readonly IOpenIdConnectRequestClient _client;
        #endregion

        #region Properties
        /// <summary>
        /// get - The configuration options for keycloak.
        /// </summary>
        /// <value></value>
        public Configuration.KeycloakOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakAdmin class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="client"></param>
        /// <param name="options"></param>
        public KeycloakService(IOpenIdConnectRequestClient client, IOptions<Configuration.KeycloakOptions> options)
        {
            this.Options = options.Value;
            this.Options.Validate(); // TODO: Figure out how to automatically validate.
            this.Options.Admin.Validate();
            this.Options.OpenIdConnect.Validate();
            this.Options.ServiceAccount.Validate();
            _client = client;
            _client.AuthClientOptions.Audience = this.Options.ServiceAccount.Audience ?? this.Options.Audience;
            _client.AuthClientOptions.Authority = this.Options.ServiceAccount.Authority ?? this.Options.Authority;
            _client.AuthClientOptions.Client = this.Options.ServiceAccount.Client ?? this.Options.Client;
            _client.AuthClientOptions.Secret = this.Options.ServiceAccount.Secret ?? this.Options.Secret;
        }
        #endregion

        #region Methods
        #endregion
    }
}
