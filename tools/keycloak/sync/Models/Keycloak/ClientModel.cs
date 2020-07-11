using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using System.Linq;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// ClientModel class, provides a model to represent a keycloak client.
    /// </summary>
    public class ClientModel : Core.Keycloak.Models.ClientModel
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ClientModel class.
        /// </summary>
        public ClientModel() { }

        /// <summary>
        /// Creates a new instance of a ClientModel class, initializes with specified arguments.
        /// </summary>
        /// <param name="client"></param>
        public ClientModel(ClientOptions client)
        {
            this.ClientId = client.ClientId;
            this.Name = client.Name;
            this.Description = client.Description;
            this.Enabled = client.Enabled;

            this.Protocol = client.Protocol;
            this.Secret = client.Secret;

            this.ConsentRequired = client.ConsentRequired;
            this.ClientAuthenticatorType = client.ClientAuthenticatorType;
            this.DefaultRoles = client.DefaultRoles;
            this.FullScopeAllowed = client.FullScopeAllowed;
            this.SurrogateAuthRequired = client.SurrogateAuthRequired;

            this.PublicClient = client.PublicClient;
            this.AuthorizationServicesEnabled = client.AuthorizationServicesEnabled;
            this.BearerOnly = client.BearerOnly;
            this.DirectAccessGrantsEnabled = client.DirectAccessGrantsEnabled;
            this.ImplicitFlowEnabled = client.ImplicitFlowEnabled;
            this.ServiceAccountsEnabled = client.ServiceAccountsEnabled;
            this.StandardFlowEnabled = client.StandardFlowEnabled;

            this.BaseUrl = client.BaseUrl;
            this.RootUrl = client.RootUrl;
            this.RedirectUris = client.RedirectUris;
            this.Origin = client.Origin;
            this.WebOrigins = client.WebOrigins;
            this.AdminUrl = client.AdminUrl;

            if (client.ProtocolMappers != null)
            {
                this.ProtocolMappers = client.ProtocolMappers.Select(m => new ProtocolMapperModel(m)).ToArray();
            }
        }
        #endregion
    }
}
