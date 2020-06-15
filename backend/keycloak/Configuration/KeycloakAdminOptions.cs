using System;
using System.ComponentModel.DataAnnotations;
using Pims.Core.Exceptions;

namespace Pims.Keycloak.Configuration
{
    /// <summary>
    /// KeycloakAdminOptions class, provides a way to configure the keycloak admin API endpoints.
    /// </summary>
    public class KeycloakAdminOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The authority URL to the keycloak admin API.
        /// </summary>
        /// <value></value>
        [Required(ErrorMessage = "Configuration Keycloak:Admin:Authority is required.")]
        public string Authority { get; set; }

        /// <summary>
        /// get/set - The users endpoint path.
        /// </summary>
        /// <value></value>
        public string Users { get; set; }
        #endregion

        #region Methods
        /// <summary>
        /// Validates the configuration for the admin endpoints.
        /// </summary>
        /// <exception type="ConfigurationException">If the configuration property is invald.</exception>
        public void Validate()
        {
            if (String.IsNullOrWhiteSpace(this.Authority))
                throw new ConfigurationException("The configuration for Keycloak:Admin:Authority is invalid or missing.");

            if (String.IsNullOrWhiteSpace(this.Users))
                throw new ConfigurationException("The configuration for Keycloak:Admin:Users is invalid or missing.");
        }
        #endregion
    }
}
