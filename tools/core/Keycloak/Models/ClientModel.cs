using System;
using System.Collections.Generic;

namespace Pims.Tools.Core.Keycloak.Models
{
    /// <summary>
    /// ClientModel class, provides a model to represent a keycloak client.
    /// </summary>
    public class ClientModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique primary key id.
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// get/set - A unique key identity for the client.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// get/set - A unique name to identify this client.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Client description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the client is enabled.
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// get/set - The client protocol.
        /// </summary>
        public string Protocol { get; set; }

        /// <summary>
        /// get/set - Access configuration.
        /// </summary>
        public Dictionary<string, bool> Access { get; set; }

        /// <summary>
        /// get/set - Authentication flow binding configuration.
        /// </summary>
        public Dictionary<string, string> AuthenticationFlowBindingOverrides { get; set; }

        // public ResourceServerModel AuthorizationServicesEnabled { get; set; }

        /// <summary>
        /// get/set - Client authentictor type.
        /// </summary>
        public string ClientAuthenticatorType { get; set; }

        /// <summary>
        /// get/set - Whether consent is required.
        /// </summary>
        public bool ConsentRequired { get; set; }

        /// <summary>
        /// get/set - Default client scopes.
        /// </summary>
        public string[] DefaultClientScopes { get; set; }

        /// <summary>
        /// get/set - Default roles for new users.
        /// </summary>
        public string[] DefaultRoles { get; set; }

        /// <summary>
        /// get/set - Frontchannel logout.
        /// </summary>
        public bool FrontchannelLogout { get; set; }

        /// <summary>
        /// get/set - Whether full scope is allowed.
        /// </summary>
        public bool FullScopeAllowed { get; set; }

        /// <summary>
        /// get/set - Node regregistration timeout.
        /// </summary>
        public int NodeReRegistrationTimeout { get; set; } = -1;

        /// <summary>
        /// get/set - Not before.
        /// </summary>
        public int NotBefore { get; set; }

        /// <summary>
        /// get/set - Optional client scopes.
        /// </summary>
        public string[] OptionalClientScopes { get; set; }

        /// <summary>
        /// get/set - An array of protocol mappers.
        /// </summary>
        public ProtocolMapperModel[] ProtocolMappers { get; set; }

        /// <summary>
        /// get/set - Whether this is a public client.
        /// </summary>
        public bool PublicClient { get; set; }

        /// <summary>
        /// get/set - A dictionary of registered nodes.
        /// </summary>
        public Dictionary<string, string[]> RegisteredNodes { get; set; }

        /// <summary>
        /// get/set - Registration access token.
        /// </summary>
        public string RegistrationAccessToken { get; set; }

        /// <summary>
        /// get/set - Whether surrogate authentication is required.
        /// </summary>
        public bool SurrogateAuthRequired { get; set; }

        /// <summary>
        /// get/set - Whether authorization services are enabled.
        /// </summary>
        public bool AuthorizationServicesEnabled { get; set; }

        /// <summary>
        /// get/set - Whether this client is a bearer only.
        /// </summary>
        public bool BearerOnly { get; set; }

        /// <summary>
        /// get/set - Whether client allows direct access.
        /// </summary>
        public bool DirectAccessGrantsEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client allows implicit flow.
        /// </summary>
        public bool ImplicitFlowEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client has a service account.
        /// </summary>
        public bool ServiceAccountsEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client has standard flow.
        /// </summary>
        public bool StandardFlowEnabled { get; set; }

        /// <summary>
        /// get/set - Client secret.
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// get/set - Client base URL.
        /// </summary>
        public string BaseUrl { get; set; }

        /// <summary>
        /// get/set - Client root URL.
        /// </summary>
        public string RootUrl { get; set; }

        /// <summary>
        /// get/set - Client redirect URIs.
        /// </summary>
        public string[] RedirectUris { get; set; }

        /// <summary>
        /// get/set - Client origin.
        /// </summary>
        public string Origin { get; set; }

        /// <summary>
        /// get/set - Client web origins.
        /// </summary>
        public string[] WebOrigins { get; set; }

        /// <summary>
        /// get/set - Client admin URL.
        /// </summary>
        public string AdminUrl { get; set; }

        /// <summary>
        /// get/set - Dictionary of attributes.
        /// </summary>
        public Dictionary<string, string> Attributes { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ClientModel class.
        /// </summary>
        public ClientModel() { }
        #endregion
    }
}
