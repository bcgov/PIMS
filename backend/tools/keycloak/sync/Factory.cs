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
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
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
            // Check if token has expired.  If it has refresh it.
            if (String.IsNullOrWhiteSpace(_token) || _tokenHandler.ReadJwtToken(_token).ValidTo <= DateTime.UtcNow)
            {
                var tokenNew = await _auth.RequestTokenAsync(_refreshToken);
                _token = tokenNew.access_token;
                _refreshToken = tokenNew.refresh_token;
            }

            // Fetch all Claims in PIMS and link or create them in keycloak.
            var claims = await HandleRequestAsync<PageModel<ClaimModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/claims?page=1&quantity=50"); // TOD: Handle paging.
            foreach (var claim in claims?.Items)
            {
                var kclaim = await GetClaimAsync(claim);
                claim.KeycloakRoleId = kclaim.id;

                _logger.LogInformation($"Updating Claim '{claim.Name}'.");
                await HandleRequestAsync<ClaimModel, ClaimModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/claims/{claim.Id}", claim);
            }

            // Fetch all Roles in PIMS and link or create them in keycloak.
            var roles = await HandleRequestAsync<PageModel<RoleModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var role in roles?.Items)
            {
                var krole = await GetRoleAsync(role);
                role.KeycloakGroupId = krole.id;

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
                if (kuser.attributes == null) kuser.attributes = new Dictionary<string, string[]>();
                kuser.attributes["agencies"] = user.Agencies.Select(a => a.Id.ToString()).ToArray();

                _logger.LogInformation($"Updating User in Keycloak '{user.Username}'.");
                var userResponse = await SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.id}", kuser);
                if (!userResponse.IsSuccessStatusCode)
                    throw new HttpResponseException(userResponse, $"Failed to update the user '{user.Username}' in keycloak");

                // Sync user roles.
                foreach (var role in user.Roles)
                {
                    var groupResponse = await SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.id}/groups/{role.KeycloakGroupId}");
                    if (!groupResponse.IsSuccessStatusCode)
                        throw new HttpResponseException(groupResponse, $"Failed to add the group '{role.Name}' to the user '{user.Username}' keycloak");
                }
            }

            return 0;
        }

        /// <summary>
        /// Get the keycloak role that matches the PIMS claim.
        /// If it doesn't exist, create it in keycloak.
        /// </summary>
        /// <param name="claim"></param>
        /// <returns></returns>
        private async Task<KModel.RoleModel> GetClaimAsync(ClaimModel claim)
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
                        id = claim.Id,
                        name = claim.Name,
                        description = claim.Description,
                        composite = false,
                        clientRole = false,
                        containerId = _options.Keycloak.Realm
                    };

                    // Add the role to keycloak and sync with PIMS.
                    var kresponse = await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/roles", krole);
                    if (kresponse.StatusCode == HttpStatusCode.Created)
                    {
                        return await GetClaimAsync(claim);
                    }
                    else
                    {
                        throw new HttpResponseException(kresponse, $"Failed to add the role '{claim.Name}' to keycloak");
                    }
                }

                throw ex;
            }
        }

        /// <summary>
        /// Get the keycloak group that matches the PIMS role.
        /// If it doesn't exist, create it in keycloak.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task<KModel.GroupModel> GetRoleAsync(RoleModel role)
        {
            try
            {
                // Make a request to keycloak to find a matching group.
                // If one is found, sync both keycloak and PIMS.
                // If one is not found, add it to keycloak and sync with PIMS.
                return await HandleRequestAsync<KModel.GroupModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups/{role.Id}");
            }
            catch (HttpResponseException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    var kgroup = new KModel.GroupModel()
                    {
                        id = role.Id,
                        name = role.Name,
                        path = $"/{role.Name}",
                        description = role.Description,
                        realmRoles = role.Claims.Select(c => c.Name).ToArray()
                    };

                    // Add the group to keycloak and sync with PIMS.
                    var kresponse = await SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/groups", kgroup);
                    if (kresponse.StatusCode == HttpStatusCode.Created)
                    {
                        return await GetRoleAsync(role);
                    }
                    else
                    {
                        throw new HttpResponseException(kresponse, $"Failed to add the group '{role.Name}' to keycloak");
                    }
                }

                throw ex;
            }
        }

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
        #endregion
    }
}
