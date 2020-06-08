using Pims.Tools.Core.Keycloak.Configuration;

namespace Pims.Tools.Import
{
    /// <summary>
    /// ToolOptions class, provides a way to configure the import tool.
    /// </summary>
    public class ToolOptions : KeycloakRequestOptions
    {
        #region Properties
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
