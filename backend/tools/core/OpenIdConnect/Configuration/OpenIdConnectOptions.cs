namespace Pims.Tools.Core.OpenIdConnect.Configuration
{
    /// <summary>
    /// OpenIdConnectOptions class, provides a way to configure the connection to an Open ID Connect authenticator.
    /// </summary>
    public class OpenIdConnectOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The URL to fetch tokens.
        /// </summary>
        /// <value></value>
        public string TokenUrl { get; set; }

        /// <summary>
        /// get/set - The Client ID.
        /// </summary>
        /// <value></value>
        public string ClientId { get; set; }

        /// <summary>
        /// get/set - The Audience name.
        /// </summary>
        /// <value></value>
        public string Audience { get; set; }

        /// <summary>
        /// get/set - The Realm name.
        /// </summary>
        /// <value></value>
        public string Realm { get; set; }

        /// <summary>
        /// get/set - The client secret.
        /// </summary>
        /// <value></value>
        public string ClientSecret { get; set; }
        #endregion
    }
}
