namespace Pims.Tools.Import
{
    /// <summary>
    /// ToolOptions class, provides a way to configure the import tool.
    /// </summary>
    public class ToolOptions
    {
        #region Properties
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

        /// <summary>
        /// get/set - Import configuration.
        /// </summary>
        /// <value></value>
        public ImportOptions Import { get; set; }
        #endregion
    }
}
