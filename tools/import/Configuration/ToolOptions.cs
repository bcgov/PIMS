using Pims.Tools.Core.Configuration;

namespace Pims.Tools.Import
{
    /// <summary>
    /// ToolOptions class, provides a way to configure the import tool.
    /// </summary>
    public class ToolOptions : RequestOptions
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
