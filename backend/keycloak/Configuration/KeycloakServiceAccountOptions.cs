using System;
using Pims.Core.Exceptions;
using Pims.Core.Http.Configuration;

namespace Pims.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakServiceAccountOptions class, provides a way to configure keycloak service account.
    /// </summary>
    public class KeycloakServiceAccountOptions : AuthClientOptions
    {
        #region Methods
        /// <summary>
        /// Validate the configuration.
        /// </summary>
        /// <exception type="ConfigurationException">The configuration is missing or invalid.</exception>
        public override void Validate()
        {
            if (String.IsNullOrWhiteSpace(this.Client))
                throw new ConfigurationException("The configuration for Keycloak:ServiceAccount:Client is invalid or missing.");

            if (String.IsNullOrWhiteSpace(this.Secret))
                throw new ConfigurationException("The configuration for Keycloak:ServiceAccount:Secret is invalid or missing.");
        }
        #endregion
    }
}
