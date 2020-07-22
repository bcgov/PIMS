using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Tools.Core.Keycloak;
using Pims.Tools.Keycloak.Sync.Configuration;
using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using SKModel = Pims.Tools.Keycloak.Sync.Models.Keycloak;
using KModel = Pims.Tools.Core.Keycloak.Models;
using Pims.Core.Exceptions;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// RealmFactory class, provides a way to configure Keycloak.
    /// </summary>
    public class RealmFactory : IRealmFactory
    {
        #region Variables
        private readonly ToolOptions _options;
        private readonly IKeycloakRequestClient _client;
        private readonly ILogger _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an Factory class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="client"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        public RealmFactory(IKeycloakRequestClient client, IOptionsMonitor<ToolOptions> options, ILogger<SyncFactory> logger)
        {
            _options = options.CurrentValue;
            _client = client;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Initialize the Keycloak realm as specified in the configuration.
        /// </summary>
        /// <returns></returns>
        public async Task<int> InitAsync()
        {
            await UpdateRealmAsync();

            return 0;
        }

        /// <summary>
        /// Update the realm information.
        /// </summary>
        /// <returns></returns>
        private async Task UpdateRealmAsync()
        {
            _logger.LogInformation($"Updating realm '{_options.Realm.Name}'");
            // Determine if realm exists, it will throw an exception if it doesn't.
            var realm = await _client.HandleGetAsync<KModel.RealmModel>(_client.AdminRoute());

            realm.DisplayName = _options.Realm.DisplayName;
            realm.DisplayNameHtml = _options.Realm.DisplayNameHtml;

            var rRes = await _client.SendJsonAsync(_client.AdminRoute(), HttpMethod.Put, realm);
            if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

            await AddUpdateRealmRolesAsync();
            await AddUpdateGroupsAsync();
            await AddUpdateClientsAsync();
        }

        /// <summary>
        /// Update the realm roles.
        /// </summary>
        /// <returns></returns>
        private async Task AddUpdateRealmRolesAsync()
        {
            foreach (var cRole in _options.Realm.Roles?.OrderBy(r => r.Composite) ?? Enumerable.Empty<RoleOptions>())
            {
                await AddUpdateRealmRoleAsync(cRole);
            }
        }

        /// <summary>
        /// Add or update each role.
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        private async Task<SKModel.RoleModel> AddUpdateRealmRoleAsync(RoleOptions config)
        {
            _logger.LogInformation($"Fetch realm role '{config.Name}'");
            var role = await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{config.Name}"), r => true);

            if (role == null)
            {
                _logger.LogInformation($"Add realm role '{config.Name}'");
                role = new SKModel.RoleModel(config)
                {
                    ContainerId = _options.Realm.Name
                };

                // Add the role to keycloak.
                var rRes = await _client.SendJsonAsync(_client.AdminRoute("roles"), HttpMethod.Post, role);
                if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

                if (config.Composite && config.RealmRoles.Any())
                {
                    // Fetch all roles for the composite.  Any missing will throw exception.
                    var roles = config.RealmRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{r}"))).Select(r => r.Result).ToArray();

                    // Link the roles to this composite role.
                    var rcRes = await _client.SendJsonAsync(_client.AdminRoute($"roles/{config.Name}/composites"), HttpMethod.Post, roles);
                    if (!rcRes.IsSuccessStatusCode) throw new HttpClientRequestException(rcRes);
                }
            }
            else
            {
                _logger.LogInformation($"Update realm role '{config.Name}'");
                role.Name = config.Name;
                role.Composite = config.Composite;
                role.ClientRole = config.ClientRole;
                role.Description = config.Description;

                // TODO: Clear existing realm roles so that the changes are correct in keycloak.

                // Update role in keycloak.
                var rRes = await _client.SendJsonAsync(_client.AdminRoute($"roles/{config.Name}"), HttpMethod.Put, role);
                if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

                if (role.Composite && config.RealmRoles.Any())
                {
                    // Fetch all roles for the composite.  Any missing will throw exception.
                    var roles = config.RealmRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{r}"))).Select(r => r.Result).ToArray();

                    // Link the roles to this composite role.
                    var rcRes = await _client.SendJsonAsync(_client.AdminRoute($"roles/{config.Name}/composites"), HttpMethod.Post, roles);
                    if (!rcRes.IsSuccessStatusCode) throw new HttpClientRequestException(rcRes);
                }
            }

            return await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{config.Name}"));
        }

        /// <summary>
        /// Add or update each group.
        /// </summary>
        /// <returns></returns>
        private async Task AddUpdateGroupsAsync()
        {
            foreach (var cGroup in _options.Realm.Groups ?? Enumerable.Empty<GroupOptions>())
            {
                await AddUpdateGroupAsync(cGroup);
            }
        }

        /// <summary>
        /// Add or update the specified group.
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        private async Task<SKModel.GroupModel> AddUpdateGroupAsync(GroupOptions config)
        {
            _logger.LogInformation($"Fetch group '{config.Name}'");
            var groups = await _client.HandleGetAsync<SKModel.GroupModel[]>(_client.AdminRoute($"groups?search={config.Name}"), r => true);
            var group = groups.FirstOrDefault();

            if (group == null)
            {
                _logger.LogInformation($"Add group '{config.Name}'");
                group = new SKModel.GroupModel(config);

                // Add the group to keycloak.
                var rRes = await _client.SendJsonAsync(_client.AdminRoute("groups"), HttpMethod.Post, group);
                if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

                // Have to look for it now that we've added it.
                groups = await _client.HandleGetAsync<SKModel.GroupModel[]>(_client.AdminRoute($"groups?search={config.Name}"), r => true);
                group = groups.FirstOrDefault();
            }
            else
            {
                _logger.LogInformation($"Update group '{config.Name}'");
                group.Name = config.Name;
                group.RealmRoles = config.RealmRoles.ToArray();

                // TODO: Clear existing realm group so that the changes are correct in keycloak.

                // Update group in keycloak.
                var rRes = await _client.SendJsonAsync(_client.AdminRoute($"groups/{group.Id}"), HttpMethod.Put, group);
                if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

                if (group.RealmRoles.Any())
                {
                    // Fetch all roles for the group.  Any missing will throw exception.
                    var roles = group.RealmRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{r}"))).Select(r => r.Result).ToArray();

                    // Update group realm roles in keycloak.
                    var grRes = await _client.SendJsonAsync(_client.AdminRoute($"groups/{group.Id}/role-mappings/realm"), HttpMethod.Post, roles);
                    if (!grRes.IsSuccessStatusCode) throw new HttpClientRequestException(grRes);
                }
            }

            return await _client.HandleGetAsync<SKModel.GroupModel>(_client.AdminRoute($"groups/{group.Id}"));
        }

        /// <summary>
        /// Add or update clients.
        /// </summary>
        /// <returns></returns>
        private async Task AddUpdateClientsAsync()
        {
            foreach (var cClient in _options.Realm.Clients ?? Enumerable.Empty<ClientOptions>())
            {
                await AddUpdateClientAsync(cClient);
            }
        }

        /// <summary>
        /// Add or update the specified client.
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        private async Task<SKModel.ClientModel> AddUpdateClientAsync(ClientOptions config)
        {
            _logger.LogInformation($"Fetch client '{config.ClientId}'");
            var clients = await _client.HandleGetAsync<SKModel.ClientModel[]>(_client.AdminRoute($"clients?clientId={config.ClientId}"));
            var client = clients.FirstOrDefault();

            if (client == null)
            {
                _logger.LogInformation($"Add client '{config.ClientId}'");
                client = new SKModel.ClientModel(config);

                // Add the client to keycloak.
                var rRes = await _client.SendJsonAsync(_client.AdminRoute("clients"), HttpMethod.Post, client);
                if (!rRes.IsSuccessStatusCode) throw new HttpClientRequestException(rRes);

                clients = await _client.HandleGetAsync<SKModel.ClientModel[]>(_client.AdminRoute($"clients?clientId={config.ClientId}"));
                client = clients.FirstOrDefault();

                // Add protocol mappers
                var mappers = await _client.HandleGetAsync<SKModel.ProtocolMapperModel[]>(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models"));
                foreach (var cMapper in config.ProtocolMappers ?? Enumerable.Empty<ProtocolMapperOptions>())
                {
                    // Check if it needs to be added or updated.
                    var mapper = mappers.FirstOrDefault(m => m.Name == cMapper.Name);

                    if (mapper == null)
                    {
                        mapper = new SKModel.ProtocolMapperModel(cMapper);

                        var cpmRes = await _client.SendJsonAsync(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models"), HttpMethod.Post, mapper);
                        if (!cpmRes.IsSuccessStatusCode) throw new HttpClientRequestException(cpmRes);
                    }
                    else
                    {
                        mapper.Name = cMapper.Name;
                        mapper.Protocol = cMapper.Protocol;
                        mapper.ProtocolMapper = cMapper.ProtocolMapper;
                        mapper.Config = cMapper.Config;

                        var cpmRes = await _client.SendJsonAsync(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models/{mapper.Id}"), HttpMethod.Put, mapper);
                        if (!cpmRes.IsSuccessStatusCode) throw new HttpClientRequestException(cpmRes);
                    }
                }

                // Fetch Service Account if required.
                if (client.ServiceAccountsEnabled)
                {
                    var serviceAccount = await _client.HandleGetAsync<KModel.UserModel>(_client.AdminRoute($"clients/{client.Id}/service-account-user"));

                    if (config.ServiceAccount?.RealmRoles?.Any() ?? false)
                    {
                        // Fetch all roles for the realm.  Any missing will throw exception.
                        var roles = config.ServiceAccount.RealmRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{r}"))).Select(r => r.Result).ToArray();

                        // Link the realm roles to this service account.
                        var srRes = await _client.SendJsonAsync(_client.AdminRoute($"users/{serviceAccount.Id}/role-mappings/realm"), HttpMethod.Post, roles);
                        if (!srRes.IsSuccessStatusCode) throw new HttpClientRequestException(srRes);

                        foreach (var csClient in config.ServiceAccount.ClientRoles ?? Enumerable.Empty<ClientRoleOptions>())
                        {
                            var sClients = await _client.HandleGetAsync<SKModel.ClientModel[]>(_client.AdminRoute($"clients?clientId={csClient.ClientId}"));
                            var sClient = sClients.First();

                            // Fetch all roles for the client.  Any missing will throw exception.
                            var scRoles = csClient.ClientRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"clients/{sClient.Id}/roles/{r}"))).Select(r => r.Result).ToArray();

                            // Link the client roles to this service account.
                            var scrRes = await _client.SendJsonAsync(_client.AdminRoute($"users/{serviceAccount.Id}/role-mappings/clients/{sClient.Id}"), HttpMethod.Post, scRoles);
                            if (!scrRes.IsSuccessStatusCode) throw new HttpClientRequestException(scrRes);
                        }
                    }
                }
            }
            else
            {
                _logger.LogInformation($"Update client '{config.ClientId}'");
                client.Name = config.Name;
                client.Description = config.Description;
                client.Enabled = config.Enabled;
                client.Protocol = config.Protocol;

                client.AuthorizationServicesEnabled = config.AuthorizationServicesEnabled;
                client.BearerOnly = config.BearerOnly;
                client.PublicClient = config.PublicClient;
                client.ConsentRequired = config.ConsentRequired;
                client.StandardFlowEnabled = config.StandardFlowEnabled;
                client.ImplicitFlowEnabled = config.ImplicitFlowEnabled;
                client.DirectAccessGrantsEnabled = config.DirectAccessGrantsEnabled;
                client.ServiceAccountsEnabled = config.ServiceAccountsEnabled;

                client.BaseUrl = config.BaseUrl;
                client.RootUrl = config.RootUrl;
                client.AdminUrl = config.AdminUrl;
                client.RedirectUris = config.RedirectUris;
                client.WebOrigins = config.WebOrigins;

                foreach (var attr in config.Attributes)
                {
                    client.Attributes[attr.Key] = attr.Value;
                }

                // Update client in keycloak.
                var cRes = await _client.SendJsonAsync(_client.AdminRoute($"clients/{client.Id}"), HttpMethod.Put, client);
                if (!cRes.IsSuccessStatusCode) throw new HttpClientRequestException(cRes);

                // Update protocol mappers
                var mappers = await _client.HandleGetAsync<SKModel.ProtocolMapperModel[]>(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models"));
                foreach (var cMapper in config.ProtocolMappers ?? Enumerable.Empty<ProtocolMapperOptions>())
                {
                    // Check if it needs to be added or updated.
                    var mapper = mappers.FirstOrDefault(m => m.Name == cMapper.Name);

                    if (mapper == null)
                    {
                        mapper = new SKModel.ProtocolMapperModel(cMapper);

                        var cpmRes = await _client.SendJsonAsync(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models"), HttpMethod.Post, mapper);
                        if (!cpmRes.IsSuccessStatusCode) throw new HttpClientRequestException(cpmRes);
                    }
                    else
                    {
                        mapper.Name = cMapper.Name;
                        mapper.Protocol = cMapper.Protocol;
                        mapper.ProtocolMapper = cMapper.ProtocolMapper;
                        mapper.Config = cMapper.Config;

                        var cpmRes = await _client.SendJsonAsync(_client.AdminRoute($"clients/{client.Id}/protocol-mappers/models/{mapper.Id}"), HttpMethod.Put, mapper);
                        if (!cpmRes.IsSuccessStatusCode) throw new HttpClientRequestException(cpmRes);
                    }
                }

                // Fetch Service Account if required.
                if (client.ServiceAccountsEnabled)
                {
                    var serviceAccount = await _client.HandleGetAsync<KModel.UserModel>(_client.AdminRoute($"clients/{client.Id}/service-account-user"));

                    if (config.ServiceAccount?.RealmRoles?.Any() ?? false)
                    {
                        // Fetch all roles for the realm.  Any missing will throw exception.
                        var roles = config.ServiceAccount.RealmRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"roles/{r}"))).Select(r => r.Result).ToArray();

                        // Link the realm roles to this service account.
                        var srRes = await _client.SendJsonAsync(_client.AdminRoute($"users/{serviceAccount.Id}/role-mappings/realm"), HttpMethod.Post, roles);
                        if (!srRes.IsSuccessStatusCode) throw new HttpClientRequestException(srRes);

                        foreach (var csClient in config.ServiceAccount.ClientRoles ?? Enumerable.Empty<ClientRoleOptions>())
                        {
                            var sClients = await _client.HandleGetAsync<SKModel.ClientModel[]>(_client.AdminRoute($"clients?clientId={csClient.ClientId}"));
                            var sClient = sClients.First();

                            // Fetch all roles for the client.  Any missing will throw exception.
                            var scRoles = csClient.ClientRoles.Select(async r => await _client.HandleGetAsync<SKModel.RoleModel>(_client.AdminRoute($"clients/{sClient.Id}/roles/{r}"))).Select(r => r.Result).ToArray();

                            // Link the client roles to this service account.
                            var scrRes = await _client.SendJsonAsync(_client.AdminRoute($"users/{serviceAccount.Id}/role-mappings/clients/{sClient.Id}"), HttpMethod.Post, scRoles);
                            if (!scrRes.IsSuccessStatusCode) throw new HttpClientRequestException(scrRes);
                        }
                    }
                }
            }

            return await _client.HandleGetAsync<SKModel.ClientModel>(_client.AdminRoute($"clients/{client.Id}"));
        }
        #endregion
    }
}
