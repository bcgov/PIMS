namespace Pims.Api.Configuration
{
    /// <summary>
    /// KeycloakServiceAccountOptions class, provides a way to configure keycloak service account.
    /// </summary>
    public class KeycloakServiceAccountOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The keycloak open id connect audience.  Most likely the same value as the client.
        /// </summary>
        /// <value></value>
        public string Audience { get; set; }

        /// <summary>
        /// get/set - The keycloak open id connect secret.
        /// </summary>
        /// <value></value>
        public string Secret { get; set; }

        /// <summary>
        /// get/set - The keycloak client id.
        /// </summary>
        /// <value></value>
        public string Client { get; set; }
        #endregion
    }
}
