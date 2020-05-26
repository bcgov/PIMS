using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Tools.Keycloak.Sync.Configuration;
using Pims.Tools.Keycloak.Sync.Exceptions;
using Pims.Tools.Keycloak.Sync.Models;
using KModel = Pims.Tools.Keycloak.Sync.Models.Keycloak;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// SyncFactory class, provides a way to sync Keycloak roles, groups and users with PIMS.
    /// </summary>
    public class SyncFactory : ISyncFactory
    {
        #region Variables
        private readonly ToolOptions _options;
        private readonly IRequestClient _client;
        private readonly ILogger _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an Factory class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="client"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        public SyncFactory(IRequestClient client, IOptionsMonitor<ToolOptions> options, ILogger<SyncFactory> logger)
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
            // Activate the service account.
            var aRes = await _client.SendRequestAsync(HttpMethod.Post, $"{_options.Api.Uri}/auth/activate");
            if (!aRes.IsSuccessStatusCode) throw new HttpResponseException(aRes);

            // Fetch all Claims in PIMS and link or create them in keycloak.
            var claims = await _client.HandleRequestAsync<PageModel<ClaimModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/claims?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var claim in claims?.Items)
            {
                var krole = await GetKeycloakRoleAsync(claim);
                claim.KeycloakRoleId = krole.Id;

                _logger.LogInformation($"Updating Claim '{claim.Name}'.");
                await _client.HandleRequestAsync<ClaimModel, ClaimModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/claims/{claim.Id}", claim);
            }

            // Fetch all Roles in PIMS and link or create them in keycloak.
            var roles = await _client.HandleRequestAsync<PageModel<RoleModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var role in roles?.Items)
            {
                var prole = await _client.HandleRequestAsync<RoleModel>(HttpMethod.Get, $"{_options.Api.Uri}/admin/roles/{role.Id}");
                var krole = await GetKeycloakGroupAsync(prole);
                role.KeycloakGroupId = krole.Id;

                _logger.LogInformation($"Updating Role '{role.Name}'.");
                await _client.HandleRequestAsync<RoleModel, RoleModel>(HttpMethod.Put, $"{_options.Api.Uri}/admin/roles/{role.Id}", role);
            }

            // Fetch all users in keycloak so that they can be synced.
            // This is useful when the database has been refreshed.
            var kusers = await _client.HandleGetAsync<KModel.UserModel[]>(_client.AdminRoute($"users"));

            // Fetch all Users in PIMS and update keycloak so they have the same roles and claims.
            var users = await _client.HandleRequestAsync<PageModel<UserModel>>(HttpMethod.Get, $"{_options.Api.Uri}/admin/users?page=1&quantity=50"); // TODO: Handle paging.
            foreach (var user in users?.Items)
            {
                var kuser = await GetUserAsync(user);

                // Ignore users that only exist in PIMS.
                if (kuser == null) continue;

                // Sync user agencies.
                if (kuser.Attributes == null) kuser.Attributes = new Dictionary<string, string[]>();
                kuser.Attributes["agencies"] = user.Agencies.Select(a => a.Id.ToString()).ToArray();

                _logger.LogInformation($"Updating User in Keycloak '{user.Username}'.");
                var userResponse = await _client.SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.Id}", kuser);
                if (!userResponse.IsSuccessStatusCode)
                    throw new HttpResponseException(userResponse, $"Failed to update the user '{user.Username}' in keycloak");

                // Sync user roles.
                foreach (var role in user.Roles)
                {
                    var groupResponse = await _client.SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/users/{kuser.Id}/groups/{role.KeycloakGroupId}");
                    if (!groupResponse.IsSuccessStatusCode)
                        throw new HttpResponseException(groupResponse, $"Failed to add the group '{role.Name}' to the user '{user.Username}' keycloak");
                }
            }

            // Add keycloak users to PIMS.
            // Only add users who don't exist.
            foreach (var kuser in kusers.Where(u => !users.Items.Any(pu => pu.Username == u.Username)))
            {
                _logger.LogInformation($"Adding User to PIMS '{kuser.Username}'.");
                var user = new UserModel(kuser);
                var uRoles = user.Roles as List<RoleModel>;

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

                // Add the user to PIMS.
                user = await _client.HandleRequestAsync<UserModel, UserModel>(HttpMethod.Post, $"{_options.Api.Uri}/admin/users", user);
            }

            return 0;
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
                return await _client.HandleRequestAsync<KModel.RoleModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/roles/{claim.Name}");
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
                    var kresponse = await _client.SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/roles", krole);
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
                var group = await _client.HandleRequestAsync<KModel.GroupModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups/{role.KeycloakGroupId ?? role.Id}");

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
                    var groups = await _client.HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups?search={role.Name}");
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
            var response = await _client.SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/groups", addGroup);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                // Get the Group Id
                var groups = await _client.HandleRequestAsync<IEnumerable<KModel.GroupModel>>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/groups?search={role.Name}");
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
            var response = await _client.SendRequestAsync(HttpMethod.Put, $"{_options.Keycloak.Admin.Authority}/groups/{group.Id}", group);
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
                var response = await _client.SendRequestAsync(HttpMethod.Post, $"{_options.Keycloak.Admin.Authority}/groups/{group.Id}/role-mappings/realm", roles);
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
        /// <param name="user"></param>
        /// <returns></returns>
        private async Task<KModel.UserModel> GetUserAsync(UserModel user)
        {
            try
            {
                // Make a request to keycloak to find a matching user.
                return await _client.HandleRequestAsync<KModel.UserModel>(HttpMethod.Get, $"{_options.Keycloak.Admin.Authority}/users/{user.Id}");
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
        #endregion
    }
}
