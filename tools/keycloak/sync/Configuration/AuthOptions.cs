using Pims.Core.Http.Configuration;
using Pims.Tools.Core.Keycloak.Configuration;

namespace Pims.Tools.Keycloak.Sync.Configuration
{
    /// <summary>
    /// AuthOptions class, provides a way to configure the import tool.
    /// </summary>
    public class AuthOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Open ID connect configuration.
        /// </summary>
        public OpenIdConnectOptions OpenIdConnect { get; set; }

        /// <summary>
        /// get/set - Keycloak configuration.
        /// </summary>
        /// <value></value>
        public KeycloakOptions Keycloak { get; set; }
        #endregion
    }
}
