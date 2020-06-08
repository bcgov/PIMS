namespace Pims.Tools.Core.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakAdminOptions class, provides a way to configure the connection to Keycloak.
    /// </summary>
    public class KeycloakAdminOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The keycloak authority URI.
        /// </summary>
        /// <value></value>
        public string Authority { get; set; }
        #endregion
    }
}
