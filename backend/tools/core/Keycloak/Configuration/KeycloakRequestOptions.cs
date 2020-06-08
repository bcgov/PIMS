using Pims.Tools.Core.Configuration;

namespace Pims.Tools.Core.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakRequestOptions class, provides a way to configure keycloak requests.
    /// </summary>
    public class KeycloakRequestOptions : RequestOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Keycloak configuration.
        /// </summary>
        /// <value></value>
        public KeycloakOptions Keycloak { get; set; }
        #endregion
    }
}
