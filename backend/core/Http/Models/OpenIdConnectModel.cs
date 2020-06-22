namespace Pims.Core.Http.Models
{
    /// <summary>
    /// OpenIdConnectModel class, provides a model to represent the open Id connect information.
    /// </summary>
    public class OpenIdConnectModel
    {
        #region Properties
        /// <summary>
        /// get/set - The issuer of the token.
        /// </summary>
        /// <value></value>
        public string Issuer { get; set; }

        /// <summary>
        /// get/set - The authorization endpoint URL.
        /// </summary>
        /// <value></value>
        public string Authorization_endpoint { get; set; }

        /// <summary>
        /// get/set - The token endpoint URL.
        /// </summary>
        /// <value></value>
        public string Token_endpoint { get; set; }

        /// <summary>
        /// get/set - The user info endpoint URL.
        /// </summary>
        /// <value></value>
        public string Userinfo_endpoint { get; set; }

        /// <summary>
        /// get/set - The logout endpoint URL.
        /// </summary>
        /// <value></value>
        public string End_session_endpoint { get; set; }

        /// <summary>
        /// get/set - The JWKS URI.
        /// </summary>
        /// <value></value>
        public string Jwks_uri { get; set; }

        /// <summary>
        /// get/set - An array of grant types supported.
        /// </summary>
        /// <value></value>
        public string[] Grant_types_supported { get; set; }

        /// <summary>
        /// get/set - An array of response types supported.
        /// </summary>
        /// <value></value>
        public string[] Response_types_supported { get; set; }

        /// <summary>
        /// get/set - An array of subject types supported.
        /// </summary>
        /// <value></value>
        public string[] Subject_types_supported { get; set; }

        /// <summary>
        /// get/set - An array of Id token signing algorythims supported.
        /// </summary>
        /// <value></value>
        public string[] Id_token_signing_alg_values_supported { get; set; }

        /// <summary>
        /// get/set - An array of response modes supported.
        /// </summary>
        /// <value></value>
        public string[] Response_modes_supported { get; set; }
        #endregion
    }
}
