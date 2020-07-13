using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Keycloak.Sync.Configuration
{
    /// <summary>
    /// ApiOptions class, provides a way to configure the connection to the API.
    /// </summary>
    public class ApiOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The URI to the API.
        /// </summary>
        /// <value></value>
        [Required(ErrorMessage = "Api:Uri configuration option required.")]
        public string Uri { get; set; }
        #endregion
    }
}
