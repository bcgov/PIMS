using Pims.Tools.Core.Configuration;
using Pims.Tools.Keycloak.Sync.Configuration.Realm;

namespace Pims.Tools.Keycloak.Sync.Configuration
{
    /// <summary>
    /// ToolOptions class, provides a way to configure the import tool.
    /// </summary>
    public class ToolOptions : RequestOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Realm configuration.
        /// </summary>
        public RealmOptions Realm { get; set; }

        /// <summary>
        /// get/set - API configuration.
        /// </summary>
        /// <value></value>
        public ApiOptions Api { get; set; }

        /// <summary>
        /// get/set - Authentication options.
        /// </summary>
        public AuthOptions Auth { get; set; }
        #endregion
    }
}
