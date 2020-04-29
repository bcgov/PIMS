namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// TokenModel class, provides a model to represent the token endpoint results.
    /// </summary>
    public class TokenModel
    {
        #region Properties
        /// <summary>
        /// get/set - Access token.
        /// </summary>
        /// <value></value>
        public string access_token { get; set; }

        /// <summary>
        /// get/set - Access token expires in.
        /// </summary>
        /// <value></value>
        public int expires_in { get; set; }

        /// <summary>
        /// get/set - Refresh token expires in.
        /// </summary>
        /// <value></value>
        public int refresh_expires_in { get; set; }

        /// <summary>
        /// get/set - Refresh token.
        /// </summary>
        /// <value></value>
        public string refresh_token { get; set; }

        /// <summary>
        /// get/set - Token type.
        /// </summary>
        /// <value></value>
        public string token_type { get; set; }

        /// <summary>
        /// get/set - Session State.
        /// </summary>
        /// <value></value>
        public string session_state { get; set; }

        /// <summary>
        /// get/set - Scope token.
        /// </summary>
        /// <value></value>
        public string scope { get; set; }
        #endregion
    }
}
