using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Tools.Keycloak.Sync.Exceptions;
using Pims.Tools.Keycloak.Sync.Extensions;
using Pims.Tools.Keycloak.Sync.Models;
using KModel = Pims.Tools.Keycloak.Sync.Models.Keycloak;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// Factory class, provides a way to sync Keycloak roles, groups and users with PIMS.
    /// </summary>
    public class Factory : IFactory
    {
        #region Variables
        private readonly ToolOptions _options;
        private readonly IOpenIdConnector _auth;
        private readonly HttpClient _client;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private readonly ILogger _logger;
        private string _token = null;
        private string _refreshToken = null;
        private readonly JsonSerializerOptions _serializeOptions = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreNullValues = true
        };
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an Factory class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="auth"></param>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="logger"></param>
        public Factory(IOptionsMonitor<ToolOptions> options, IOpenIdConnector auth, IHttpClientFactory clientFactory, JwtSecurityTokenHandler tokenHandler, ILogger<Factory> logger)
        {
            _options = options.CurrentValue;
            _auth = auth;
            _client = clientFactory.CreateClient("Pims.Tools.Keycloak.Sync");
            _tokenHandler = tokenHandler;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Sync roles, groups and users in keycloak and PIMS.
        /// </summary>
        /// <returns></returns>
        public async Task<int> SyncAsync()
        {
            await AddDefaultRolesToKeycloak();
            await UpdateServiceAccount();

            // Fetch all Claims in PIMS and link or create them in keycloak.
            var claims = await HandleRequestAsync<PageModel<ClaimModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/claims?page=1&quantity=50"); // TOD: Handle paging.
            foreach (var claim in claims?.Items)
            {
                var krole = await GetKeycloakRoleAsync(claim);
                claim.KeycloakRoleId = krole.Id;

                _logger.LogInformation($"Updating Claim '{claim.Name}'.");
                await HandleRequestAsync<ClaimModel, ClaimModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/claims/{claim.Id}", claim);
            }

            // Fetch all Roles in PIMS and link or create them in keycloak.
            var roles = await HandleRequestAsync<PageModel<RoleModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var role in roles?.Items)
            {
                var prole = await HandleRequestAsync<RoleModel>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles/{role.Id}");
                var krole = await GetKeycloakGroupAsync(prole);
                role.KeycloakGroupId = krole.Id;

                _logger.LogInformation($"Updating Role '{role.Name}'.");
                await HandleRequestAsync<RoleModel, RoleModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/roles/{role.Id}", role);
            }

            // Fetch all Users in PIMS and update keycloak so they have the same roles and claims.
            var users = await HandleRequestAsync<PageModel<UserModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/users?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var user in users?.Items)
            {
                var kuser = await GetUserAsync(user);

                if (kuser == null) continue;

                // Sync user agencies.
                if (kuser.Attributes == null) kuser.Attributes = new Dictionary<string, string[]>();
                kuser.Attributes["agencies"] = user.Agencies.Select(a => a.Id.ToString()).ToArray();

                _logger.LogInformation($"Updating User in Keycloak '{user.Username}'.");
                var userResponse = await SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.Id}", kuser);
                if (!userResponse.IsSuccessStatusCode)
                    throw new HttpResponseException(userResponse, $"Failed to update the user '{user.Username}' in keycloak");

                // Sync user roles.
                foreach (var role in user.Roles)
                {
                    var groupResponse = await SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.Id}/groups/{role.KeycloakGroupId}");
                    if (!groupResponse.IsSuccessStatusCode)
                        throw new HttpResponseException(groupResponse, $"Failed to add the group '{role.Name}' to the user '{user.Username}' keycloak");
                }
            }

            return 0;
        }

        /// <summary>
        /// Adds default required roles to keycloak.
        /// </summary>
        /// <returns></returns>
        private async Task AddDefaultRolesToKeycloak()
        {
            // Need to add basic roles to keycloak so that requests can be made to the API.
            foreach (var claim in _options.Sync.Claims)
            {
                await GetKeycloakRoleAsync(new ClaimModel()
                {
                    Name = claim
                });
            }
        }

        /// <summary>
        /// Update the service account with the appropriate roles.
        /// </summary>
        /// <returns></returns>
        private async Task UpdateServiceAccount()
        {
            // Get the Service Account being used to run this job.
            // Update the serviceAccountUser with the appropriate roles.
            var saClients = await HandleRequestAsync<IEnumerable<KModel.ClientModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/clients?clientId={_options.Keycloak.ClientId}");
            var saUser = await HandleRequestAsync<KModel.UserModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/clients/{saClients.First().Id}/service-account-user");
            var saRoles = await HandleRequestAsync<IEnumerable<KModel.RoleModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/roles");

            await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/users/{saUser.Id}/role-mappings/realm", saRoles.Where(r => _options.Sync.Claims.Contains(r.Name)).ToArray());
            await RefreshAccessTokenAsync(true);
        }

        #region Claim/Role
        /// <summary>
        /// Get the keycloak role that matches the PIMS claim.
        /// If it doesn't exist, create it in keycloak.
        /// </summary>
        /// <param name="claim"></param>
        /// <returns></returns>
        private async Task<KModel.RoleModel> GetKeycloakRoleAsync(ClaimModel claim)
        {
            try
            {
                // Make a request to keycloak to find a matching role.
                // If one is found, sync both keycloak and PIMS.
                // If one is not found, add it to keycloak and sync with PIMS.
                return await HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/roles/{claim.Name}");
            }
            catch (HttpResponseException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    var krole = new KModel.RoleModel()
                    {
                        Name = claim.Name,
                        Description = claim.Description,
                        Composite = false,
                        ClientRole = false,
                        ContainerId = _options.Keycloak.Realm
                    };

                    // Add the role to keycloak and sync with PIMS.
                    var kresponse = await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/roles", krole);
                    if (kresponse.StatusCode == HttpStatusCode.Created)
                    {
                        return await GetKeycloakRoleAsync(claim);
                    }
                    else
                    {
                        throw new HttpResponseException(kresponse, $"Failed to add the role '{claim.Name}' to keycloak");
                    }
                }

                throw ex;
            }
        }
        #endregion

        #region Role/Group
        /// <summary>
        /// Get the keycloak group that matches the PIMS role.
        /// If it doesn't exist, create it in keycloak.
        /// </summary>
        /// <param name="role"></param>
        /// <param name="update"></param>
        /// <returns></returns>
        private async Task<KModel.GroupModel> GetKeycloakGroupAsync(RoleModel role, bool update = true)
        {
            try
            {
                // Make a request to keycloak to find a matching group.
                // If one is found, sync both keycloak and PIMS.
                // If one is not found, add it to keycloak and sync with PIMS.
                var group = await HandleRequestAsync<KModel.GroupModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups/{role.KeycloakGroupId ?? role.Id}");

                // If the roles match the claims, return it.
                if (update)
                    return await UpdateGroupInKeycloak(group, role);

                return group;
            }
            catch (HttpResponseException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    // Check if the group exists as a different name.
                    var groups = await HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups?search={role.Name}");
                    var existingGroup = groups.FirstOrDefault(g => g.Name == role.Name);

                    if (existingGroup != null)
                    {
                        role.KeycloakGroupId = existingGroup.Id;
                        if (update)
                        {
                            return await UpdateGroupInKeycloak(existingGroup, role);
                        }
                        return existingGroup;
                    }
                    else
                    {
                        return await AddGroupToKeycloak(role);
                    }
                }

                throw ex;
            }
        }

        /// <summary>
        /// Add a group to keycloak.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task<KModel.GroupModel> AddGroupToKeycloak(RoleModel role)
        {
            var addGroup = new KModel.GroupModel()
            {
                Name = role.Name,
                Path = $"/{role.Name}",
                RealmRoles = role.Claims.Select(c => c.Name).ToArray()
            };

            // Add the group to keycloak and sync with PIMS.
            var response = await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/groups", addGroup);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                // Get the Group Id
                var groups = await HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups?search={role.Name}");
                role.KeycloakGroupId = groups.FirstOrDefault().Id;
                return await GetKeycloakGroupAsync(role, false);
            }
            else
            {
                throw new HttpResponseException(response, $"Failed to add the group '{role.Name}' to keycloak");
            }
        }

        /// <summary>
        /// Update a group in keycloak.
        /// </summary>
        /// <param name="group"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task<KModel.GroupModel> UpdateGroupInKeycloak(KModel.GroupModel group, RoleModel role)
        {
            group.RealmRoles = role.Claims.Select(c => c.Name).ToArray();

            // Update the group in keycloak.
            var response = await SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/groups/{group.Id}", group);
            if (response.IsSuccessStatusCode)
            {
                await AddRolesToGroupInKeycloak(group, role);
                return await GetKeycloakGroupAsync(role, false);
            }
            else
            {
                throw new HttpResponseException(response, $"Failed to update the group '{role.Name}' in keycloak");
            }
        }

        /// <summary>
        /// Add roles to the group in keycloak.
        /// </summary>
        /// <param name="group"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task AddRolesToGroupInKeycloak(KModel.GroupModel group, RoleModel role)
        {
            foreach (var claim in role.Claims)
            {
                // Get the matching role from keycloak.
                //var krole = await HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/roles/{claim.Name}");
                var roles = role.Claims.Select(c => new KModel.RoleModel()
                {
                    Id = c.KeycloakRoleId.Value,
                    Name = c.Name,
                    Composite = false,
                    ClientRole = false,
                    ContainerId = _options.Keycloak.Realm,
                    Description = c.Description
                }).ToArray();

                // Update the group in keycloak.
                var response = await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/groups/{group.Id}/role-mappings/realm", roles);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpResponseException(response, $"Failed to update the group '{role.Name}' with the role '{claim.Name}' in keycloak");
                }
            }
        }
        #endregion

        #region User
        /// <summary>
        /// Get the keycloak user that matches the PIMS user.
        /// If it doesn't exist return 'null'.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task<KModel.UserModel> GetUserAsync(UserModel role)
        {
            try
            {
                // Make a request to keycloak to find a matching user.
                // If one is found, sync both keycloak and PIMS.
                // If one is not found, ignore it.
                return await HandleRequestAsync<KModel.UserModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/users/{role.Id}");
            }
            catch (HttpResponseException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }

                throw ex;
            }
        }
        #endregion

        #region HTTP Requests
        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        private async Task<RT> RetryAsync<RT>(HttpMethod method, string url, int attempt = 1)
            where RT : class
        {
            try
            {
                return await HandleRequestAsync<RT>(method, url);
            }
            catch (HttpRequestException)
            {
                // Make another attempt;
                if (_options.Sync.RetryAfterFailure && attempt <= _options.Sync.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_options.Sync.RetryAttempts}");
                    return await RetryAsync<RT>(method, url, ++attempt);
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        private async Task<RT> RetryAsync<RT, T>(HttpMethod method, string url, T data = default, int attempt = 1)
            where RT : class
            where T : class
        {
            try
            {
                return await HandleRequestAsync<RT, T>(method, url, data);
            }
            catch (HttpResponseException ex)
            {
                _logger.LogError($"Sync failed: status: {ex.StatusCode} Details: {ex.Details}");

                // Make another attempt;
                if (_options.Sync.RetryAfterFailure && attempt <= _options.Sync.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_options.Sync.RetryAttempts}");
                    return await RetryAsync<RT, T>(method, url, data, ++attempt);
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        private async Task<RT> HandleRequestAsync<RT>(HttpMethod method, string url)
            where RT : class
        {
            var response = await SendRequestAsync(method, url);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializeOptions);
            }

            throw new HttpResponseException(response);
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private async Task<RT> HandleRequestAsync<RT, T>(HttpMethod method, string url, T data)
            where RT : class
            where T : class
        {
            var response = await SendRequestAsync(method, url, data);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializeOptions);
            }

            throw new HttpResponseException(response);
        }

        /// <summary>
        /// Make an HTTP request to the configured endpoint URL.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        private async Task<HttpResponseMessage> SendRequestAsync(HttpMethod method, string url)
        {
            await RefreshAccessTokenAsync();

            var request = new HttpRequestMessage(method, url);
            request.Headers.Add("Authorization", $"Bearer {_token}");
            request.Headers.Add("User-Agent", "Pims.Tools.Import");

            var response = await _client.SendAsync(request);

            return response;
        }

        /// <summary>
        /// Make an HTTP request to the configured endpoint URL.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private async Task<HttpResponseMessage> SendRequestAsync<T>(HttpMethod method, string url, T data)
            where T: class
        {
            await RefreshAccessTokenAsync();

            var request = new HttpRequestMessage(method, url);
            request.Headers.Add("Authorization", $"Bearer {_token}");
            request.Headers.Add("User-Agent", "Pims.Tools.Import");

            if (data != null)
            {
                var json = JsonSerializer.Serialize(data, _serializeOptions);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await _client.SendAsync(request);

            return response;
        }

        /// <summary>
        /// Refresh the access token if required.
        /// </summary>
        /// <param name="force"></param>
        /// <returns></returns>
        private async Task RefreshAccessTokenAsync(bool force = false)
        {
            // Check if token has expired.  If it has refresh it.
            if (force || String.IsNullOrWhiteSpace(_token) || _tokenHandler.ReadJwtToken(_token).ValidTo <= DateTime.UtcNow)
            {
                var tokenNew = await _auth.RequestTokenAsync(_refreshToken);
                _token = tokenNew.Access_token;
                _refreshToken = tokenNew.Refresh_token;
            }
        }
        #endregion
        #endregion
    }
}
