namespace Pims.Keycloak
{
    /// <summary>
    /// KeycloakAdmin class, provides a service for sending HTTP requests to the keycloak admin API.
    ///     - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_overview
    /// </summary>
    public partial class KeycloakAdmin : IKeycloakAdmin
    {
        #region Variables
        private readonly IKeycloakRequestClient _client;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakAdmin class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="client"></param>
        public KeycloakAdmin(IKeycloakRequestClient client)
        {
            client.Options.Validate(); // TODO: Figure out how to automatically validate.
            client.Options.Admin.Validate();
            client.Options.OpenIdConnect.Validate();
            client.Options.ServiceAccount.Validate();
            _client = client;
        }
        #endregion

        #region Methods
        #endregion
    }
}
