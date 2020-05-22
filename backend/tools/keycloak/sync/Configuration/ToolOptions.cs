namespace Pims.Tools.Keycloak.Sync.Configuration
{
    /// <summary>
    /// ToolOptions class, provides a way to configure the import tool.
    /// </summary>
    public class ToolOptions
    {
        #region Properties

        /// <summary>
        /// get/set - Sync configuration.
        /// </summary>
        /// <value></value>
        public SyncOptions Sync { get; set; }

        /// <summary>
        /// get/set - Keycloak configuration.
        /// </summary>
        /// <value></value>
        public KeycloakOptions Keycloak { get; set; }

        /// <summary>
        /// get/set - API configuration.
        /// </summary>
        /// <value></value>
        public ApiOptions Api { get; set; }
        #endregion
    }
}
