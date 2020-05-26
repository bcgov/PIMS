using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ClientOptions class, provides a way to configure a client.
    /// </summary>
    public class ClientOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Unique key to identify client.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the client.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Description of the client.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether client is enabled.
        /// </summary>
        public bool Enabled { get; set; } = true;

        /// <summary>
        /// get/set - Client secret.
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// get/set - Whether consent is required.
        /// </summary>
        public bool ConsentRequired { get; set; } = false;

        /// <summary>
        /// get/set - Client authentication type.
        /// </summary>
        public string ClientAuthenticatorType { get; set; }

        /// <summary>
        /// get/set - Whether full scope is allowed.
        /// </summary>
        public bool FullScopeAllowed { get; set; }

        /// <summary>
        /// get/set - Client protocol.
        /// </summary>
        public string Protocol { get; set; } = "openid-connect";

        /// <summary>
        /// get/set - Whether client is bearer only.
        /// </summary>
        public bool BearerOnly { get; set; }

        /// <summary>
        /// get/set - Whether client is public.
        /// </summary>
        public bool PublicClient { get; set; }

        /// <summary>
        /// get/set - Whether client authorization services are enabled.
        /// </summary>
        public bool AuthorizationServicesEnabled { get; set; } = false;

        /// <summary>
        /// get/set - Whether client allows standard flow.
        /// </summary>
        public bool StandardFlowEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client allows implicit flow. 
        /// </summary>
        public bool ImplicitFlowEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client allows direct access grants.
        /// </summary>
        public bool DirectAccessGrantsEnabled { get; set; }

        /// <summary>
        /// get/set - Whether client has service account.
        /// </summary>
        public bool ServiceAccountsEnabled { get; set; }

        /// <summary>
        /// get/set - Whether surrogate authentication is required.
        /// </summary>
        public bool SurrogateAuthRequired { get; set; }

        /// <summary>
        /// get/set - Client origin.
        /// </summary>
        public string Origin { get; set; }

        /// <summary>
        /// get/set - Client root URL.
        /// </summary>
        public string RootUrl { get; set; }

        /// <summary>
        /// get/set - Client redirect URIs.
        /// </summary>
        public string[] RedirectUris { get; set; }

        /// <summary>
        /// get/set - Client base URL.
        /// </summary>
        public string BaseUrl { get; set; }

        /// <summary>
        /// get/set - Client admin URL.
        /// </summary>
        public string AdminUrl { get; set; }

        /// <summary>
        /// get/set - Client web origins.
        /// </summary>
        public string[] WebOrigins { get; set; }

        /// <summary>
        /// get/set - Client default roles.
        /// </summary>
        public string[] DefaultRoles { get; set; }

        /// <summary>
        /// get/set - Client service account configuration.
        /// </summary>
        public ServiceAccountOptions ServiceAccount { get; set; }

        /// <summary>
        /// get/set - An array of client protocol mappers.
        /// </summary>
        public ProtocolMapperOptions[] ProtocolMappers { get; set; }

        /// <summary>
        /// get/set - A dictionary of attributes.
        /// </summary>
        public Dictionary<string, string> Attributes { get; set; }
        #endregion
    }
}
