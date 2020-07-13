using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Import
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

        /// <summary>
        /// get/set - The URL to fetch tokens.
        /// </summary>
        /// <value></value>
        [Required(ErrorMessage = "Api:TokenUrl configuration option required.")]
        public string TokenUrl { get; set; }

        /// <summary>
        /// get/set - The URL to import items to.
        /// </summary>
        /// <value></value>
        [Required]
        public string ImportUrl { get; set; }

        /// <summary>
        /// get/set - The HTTP method to use when making requests to the ImportUrl.
        /// </summary>
        /// <value></value>
        public string HttpMethod { get; set; } = "POST";
        #endregion
    }
}
