using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Exceptions;
using Pims.Tools.Core.Keycloak;
using Pims.Tools.Keycloak.Sync.Configuration;
using Pims.Tools.Keycloak.Sync.Models;
using KModel = Pims.Tools.Core.Keycloak.Models;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// SyncFactory class, provides a way to sync Keycloak roles, groups and users with PIMS.
    /// </summary>
    public class SyncFactory : ISyncFactory
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
        public SyncFactory(IKeycloakRequestClient client, IOptionsMonitor<ToolOptions> options, ILogger<SyncFactory> logger)
        {
            _options = options.CurrentValue;
            _client = client;
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
            var log = new StringBuilder();

            await ActivateAccountAsync();
            await SyncClaimsAsync(log);
            await SyncRolesAsync(log);
            await SyncUsersAsync(log);

            _logger.LogInformation($"---------------------{Environment.NewLine}Summary{Environment.NewLine}---------------------{Environment.NewLine}{log}");

            return 0;
        }

        #region Helpers
        /// <summary>
        /// Activate the service account.
        /// </summary>
        /// <returns></returns>
        private async Task ActivateAccountAsync()
        {
            var aRes = await _client.SendAsync($"{_options.Api.Uri}/auth/activate", HttpMethod.Post);
            if (!aRes.IsSuccessStatusCode) throw new HttpClientRequestException(aRes);
        }

        #region Claim/Role
        /// <summary>
        /// Fetch all Claims in PIMS and link or create them in keycloak.
        /// </summary>
        /// <param name="log"></param>
        /// <returns></returns>
        private async Task SyncClaimsAsync(StringBuilder log)
        {
            var claims = await _client.HandleRequestAsync<PageModel<ClaimModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/claims?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var claim in claims?.Items)
            {
                var krole = await GetKeycloakRoleAsync(claim);
                claim.KeycloakRoleId = krole.Id;

                _logger.LogInformation($"Updating Claim '{claim.Name}'.");
                log.Append($"Keycloak - Claim updated '{claim.Name}'{Environment.NewLine}");
                await _client.HandleRequestAsync<ClaimModel, ClaimModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/claims/{claim.Id}", claim);
            }
        }

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
                return await _client.HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/roles/{claim.Name}");
            }
            catch (HttpClientRequestException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    var krole = new KModel.RoleModel()
                    {
                        Name = claim.Name,
                        Description = claim.Description,
                        Composite = false,
                        ClientRole = false,
                        ContainerId = _options.Auth.Keycloak.Realm
                    };

                    // Add the role to keycloak and sync with PIMS.
                    var kresponse = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/roles", HttpMethod.Post, krole);
                    if (kresponse.StatusCode == HttpStatusCode.Created)
                    {
                        return await GetKeycloakRoleAsync(claim);
                    }
                    else
                    {
                        throw new HttpClientRequestException(kresponse, $"Failed to add the role '{claim.Name}' to keycloak");
                    }
                }

                throw ex;
            }
        }
        #endregion

        #region Role/Group
        /// <summary>
        /// Fetch all Roles in PIMS and link or create them in keycloak.
        /// </summary>
        /// <param name="log"></param>
        /// <returns></returns>
        private async Task SyncRolesAsync(StringBuilder log)
        {
            var roles = await _client.HandleRequestAsync<PageModel<RoleModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var role in roles?.Items)
            {
                var prole = await _client.HandleRequestAsync<RoleModel>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles/{role.Id}");
                var krole = await GetKeycloakGroupAsync(prole, true);
                role.KeycloakGroupId = krole.Id;

                _logger.LogInformation($"Updating Role '{role.Name}'.");
                await _client.HandleRequestAsync<RoleModel, RoleModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/roles/{role.Id}", role);
                log.Append($"Keycloak - Role updated '{role.Name}'{Environment.NewLine}");
            }
        }

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
                var group = await _client.HandleRequestAsync<KModel.GroupModel>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/groups/{role.KeycloakGroupId ?? role.Id}");

                // If the roles match the claims, return it.
                if (update)
                    return await UpdateGroupInKeycloak(group, role);

                return group;
            }
            catch (HttpClientRequestException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    // Check if the group exists as a different name.
                    var groups = await _client.HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/groups?search={role.Name}");
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
            var response = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/groups", HttpMethod.Post, addGroup);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                // Get the Group Id
                var groups = await _client.HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/groups?search={role.Name}");
                role.KeycloakGroupId = groups.FirstOrDefault().Id;
                return await GetKeycloakGroupAsync(role, false);
            }
            else
            {
                throw new HttpClientRequestException(response, $"Failed to add the group '{role.Name}' to keycloak");
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

            // Update the group in keycloak.
            var response = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/groups/{group.Id}", HttpMethod.Put, group);
            if (response.IsSuccessStatusCode)
            {
                await RemoveRolesFromGroupInKeycloak(group, role);
                await AddRolesToGroupInKeycloak(group, role);
                return await GetKeycloakGroupAsync(role, false);
            }
            else
            {
                throw new HttpClientRequestException(response, $"Failed to update the group '{role.Name}' in keycloak");
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
            // Get the matching role from keycloak.
            //var krole = await HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/roles/{claim.Name}");
            var roles = role.Claims.Select(c => new KModel.RoleModel()
            {
                Id = c.KeycloakRoleId.Value,
                Name = c.Name,
                Composite = false,
                ClientRole = false,
                ContainerId = _options.Auth.Keycloak.Realm,
                Description = c.Description
            }).ToArray();

            // Update the group in keycloak.
            var response = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/groups/{group.Id}/role-mappings/realm", HttpMethod.Post, roles);
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpClientRequestException(response, $"Failed to update the group '{role.Name}' with the roles '{String.Join(",", roles.Select(r => r.Name).ToArray())}' in keycloak");
            }
        }

        /// <summary>
        /// Remove roles from the group in keycloak.
        /// </summary>
        /// <param name="group"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        private async Task RemoveRolesFromGroupInKeycloak(KModel.GroupModel group, RoleModel role)
        {
            var removeRoles = group.RealmRoles.Where(r => !role.Claims.Select(c => c.Name).Contains(r));

            foreach (var rname in removeRoles)
            {
                // Get the matching role from keycloak.
                var krole = await _client.HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/roles/{rname}");
                var roles = new[] {
                    new KModel.RoleModel()
                    {
                        Id = krole.Id,
                        Name = krole.Name,
                        Composite = false,
                        ClientRole = false,
                        ContainerId = _options.Auth.Keycloak.Realm,
                        Description = krole.Description
                    }
                };

                // Update the group in keycloak.
                var response = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/groups/{group.Id}/role-mappings/realm", HttpMethod.Delete, roles);
                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpClientRequestException(response, $"Failed to update the group '{role.Name}' removing role '{rname}' in keycloak");
                }
            }
        }
        #endregion

        #region User
        /// <summary>
        /// Fetch all Users in PIMS and update keycloak so they have the same roles and claims.
        /// </summary>
        /// <param name="log"></param>
        /// <returns></returns>
        private async Task SyncUsersAsync(StringBuilder log)
        {
            // Fetch all users in keycloak so that they can be synced.
            // This is useful when the database has been refreshed.
            var kusers = await _client.HandleGetAsync<KModel.UserModel[]>(_client.AdminRoute($"users"));

            var page = 1;
            var quantity = 50;
            var users = new List<UserModel>();
            var pageOfUsers = await _client.HandleRequestAsync<PageModel<UserModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/users?page={page}&quantity={quantity}"); // TODO: Replace paging with specific requests for a user.
            users.AddRange(pageOfUsers.Items);

            // Keep asking for pages of users until we have them all.
            while (pageOfUsers.Items.Count() == quantity)
            {
                pageOfUsers = await _client.HandleRequestAsync<PageModel<UserModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/users?page={++page}&quantity={quantity}");
                users.AddRange(pageOfUsers.Items);
            }

            foreach (var user in users)
            {
                var kuser = await GetUserAsync(user);

                // Ignore users that only exist in PIMS.
                if (kuser == null) continue;

                // Sync user agencies.
                if (kuser.Attributes == null) kuser.Attributes = new Dictionary<string, string[]>();
                kuser.Enabled = !user.IsDisabled;
                kuser.FirstName = user.FirstName;
                kuser.LastName = user.LastName;
                kuser.EmailVerified = user.EmailVerified;
                kuser.Attributes["displayName"] = new[] { user.DisplayName };
                kuser.Attributes["position"] = new[] { user.Position };
                kuser.Attributes["agencies"] = user.Agencies.Select(a => a.Id.ToString()).ToArray();

                _logger.LogInformation($"Updating User in Keycloak '{user.Username}'.");
                log.Append($"Keycloak - User updated '{user.Username}'{Environment.NewLine}");
                var userResponse = await _client.SendJsonAsync($"{_options.Auth.Keycloak.Admin.Authority}/users/{kuser.Id}", HttpMethod.Put, kuser);
                if (!userResponse.IsSuccessStatusCode)
                    throw new HttpClientRequestException(userResponse, $"Failed to update the user '{user.Username}' in keycloak");

                // Sync user roles.
                foreach (var role in user.Roles)
                {
                    var groupResponse = await _client.SendAsync($"{_options.Auth.Keycloak.Admin.Authority}/users/{kuser.Id}/groups/{role.KeycloakGroupId}", HttpMethod.Put);
                    if (!groupResponse.IsSuccessStatusCode)
                        throw new HttpClientRequestException(groupResponse, $"Failed to add the group '{role.Name}' to the user '{user.Username}' keycloak");
                }
            }

            // Add keycloak users to PIMS.
            // Only add users who don't exist.
            foreach (var kuser in kusers.Where(u => !users.Any(pu => pu.Username == u.Username)))
            {
                try
                {
                    if (String.IsNullOrWhiteSpace(kuser.Email) || String.IsNullOrWhiteSpace(kuser.FirstName) || String.IsNullOrWhiteSpace(kuser.LastName))
                    {
                        _logger.LogInformation($"Unable to add user to PIMS '{kuser.Username}'.");
                        continue;
                    }

                    _logger.LogInformation($"Adding User to PIMS '{kuser.Username}'.");
                    var user = new UserModel(kuser);
                    var uRoles = user.Roles as List<RoleModel>;

                    // Check if the agencies listed in Keycloak exist in PIMS.  If they don't report the issue in the summary.
                    var removeAgencies = new List<AgencyModel>();
                    if (user.Agencies?.Any() == true)
                    {
                        var agencies = user.Agencies.ToArray();
                        foreach (var agency in agencies)
                        {
                            var aexists = await _client.HandleRequestAsync<AgencyModel>(HttpMethod.Get, $"{_options.Api.Uri}/admin/agencies/{agency.Id}", r =>
                            {
                                _logger.LogError($"Agency '{agency.Id}' does not exist in PIMS.", user);
                                log.Append($"PIMS - Agency missing '{agency.Id}'{Environment.NewLine}");
                                removeAgencies.Add(agency);
                                return true;
                            });
                        }
                    }

                    // Remove any agencies.
                    removeAgencies.ForEach(a => ((List<AgencyModel>)user.Agencies).Remove(a));

                    // Fetch the users groups from keycloak.
                    var kgroups = await _client.HandleGetAsync<KModel.GroupModel[]>(_client.AdminRoute($"users/{kuser.Id}/groups"));

                    // Fetch the group from PIMS.
                    foreach (var kgroup in kgroups)
                    {
                        var role = await _client.HandleGetAsync<RoleModel>($"{_options.Api.Uri}/admin/roles/name/{kgroup.Name}", r => true);
                        if (role != null)
                        {
                            uRoles.Add(role);
                        }
                    }

                    user.Roles = uRoles;

                    // Add the user to PIMS.
                    user = await _client.HandleRequestAsync<UserModel, UserModel>(HttpMethod.Post, $"{_options.Api.Uri}/admin/users", user);
                    log.Append($"Keycloak User added to PIMS '{user.Username}'{Environment.NewLine}");
                }
                catch (HttpClientRequestException ex)
                {
                    _logger.LogError($"Failed to add keycloak user '{kuser.Email}' to PIMS.", ex);
                }
            }
        }

        /// <summary>
        /// Get the keycloak user that matches the PIMS user.
        /// If it doesn't exist return 'null'.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        private async Task<KModel.UserModel> GetUserAsync(UserModel user)
        {
            try
            {
                // Make a request to keycloak to find a matching user.
                return await _client.HandleRequestAsync<KModel.UserModel>(HttpMethod.Get, $"{_options.Auth.Keycloak.Admin.Authority}/users/{user.Id}");
            }
            catch (HttpClientRequestException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }

                throw ex;
            }
        }
        #endregion
        #endregion
        #endregion
    }
}
