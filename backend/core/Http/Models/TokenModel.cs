namespace Pims.Core.Http.Models
{
    /// <summary>
    /// TokenModel class, provides a model that represents the keycloak token.
    /// </summary>
    public class TokenModel
    {
        #region Properties
        /// <summary>
        /// get/set - The access token.
        /// </summary>
        /// <value></value>
        public string Access_token { get; set; }

        /// <summary>
        /// get/set - When the token expires.
        /// </summary>
        /// <value></value>
        public int Expires_in { get; set; }

        /// <summary>
        /// get/set - When the refresh token expires.
        /// </summary>
        /// <value></value>
        public int Refresh_expires_in { get; set; }

        /// <summary>
        /// get/set - The refresh token.
        /// </summary>
        /// <value></value>
        public string Refresh_token { get; set; }

        /// <summary>
        /// get/set - The type of token.
        /// </summary>
        /// <value></value>
        public string Token_type { get; set; }

        /// <summary>
        /// get/set - Session state information.
        /// </summary>
        /// <value></value>
        public string Session_state { get; set; }

        /// <summary>
        /// get/set - The scope of the token.
        /// </summary>
        /// <value></value>
        public string Scope { get; set; }
        #endregion
    }
}
