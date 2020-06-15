using CsvHelper.Configuration;
using Pims.Core.Http.Configuration;
using System;

namespace Pims.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakOptions class, provides a way to configure keycloak.
    /// </summary>
    public class KeycloakOptions : AuthClientOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The keycloak service account configuration.
        /// This is for authenticating the api interaction with keycloak.
        /// </summary>
        /// <value></value>
        public KeycloakServiceAccountOptions ServiceAccount { get; set; }

        /// <summary>
        /// get/set - The keycloak open id connect endpoint configuration.
        /// </summary>
        /// <value></value>
        public OpenIdConnectOptions OpenIdConnect { get; set; }

        /// <summary>
        /// get/set - The keycloak admin API endpoint configuration.
        /// </summary>
        /// <value></value>
        public KeycloakAdminOptions Admin { get; set; }
        #endregion

        #region Methods
        /// <summary>
        /// Validates the configuration for keycloak.
        /// </summary>
        /// <exception type="ConfigurationException">If the configuration property is invald.</exception>
        public override void Validate()
        {
            if (String.IsNullOrWhiteSpace(this.Authority))
                throw new ConfigurationException("The configuration for Keycloak:Authority is invalid or missing.");
            if (String.IsNullOrWhiteSpace(this.Audience))
                throw new ConfigurationException("The configuration for Keycloak:Audience is invalid or missing.");
            if (String.IsNullOrWhiteSpace(this.Client))
                throw new ConfigurationException("The configuration for Keycloak:Client is invalid or missing.");
        }
        #endregion
    }
}
