using System;
using Pims.Keycloak.Exceptions;

namespace Pims.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakServiceAccountOptions class, provides a way to configure keycloak service account.
    /// </summary>
    public class KeycloakServiceAccountOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The service account keycloak open id connect authority URL.
        /// </summary>
        /// <value></value>
        public string Authority { get; set; }

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

        #region Methods
        /// <summary>
        /// Validate the configuration.
        /// </summary>
        /// <exception type="ConfigurationException">The configuration is missing or invalid.</exception>
        public void Validate()
        {
            if (String.IsNullOrWhiteSpace(this.Client))
                throw new ConfigurationException("The configuration for Keycloak:ServiceAccount:Client is invalid or missing.");

            if (String.IsNullOrWhiteSpace(this.Secret))
                throw new ConfigurationException("The configuration for Keycloak:ServiceAccount:Secret is invalid or missing.");
        }
        #endregion
    }
}
