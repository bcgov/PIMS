using Pims.Core.Http.Configuration;

namespace Pims.Tools.Core.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakOptions class, provides a way to configure the connection to Keycloak.
    /// </summary>
    public class KeycloakOptions : AuthClientOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The keycloak realm.
        /// </summary>
        public string Realm { get; set; }

        /// <summary>
        /// get/set - The admin configuration.
        /// </summary>
        public KeycloakAdminOptions Admin { get; set; }
        #endregion
    }
}
