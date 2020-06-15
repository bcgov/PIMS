using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Pims.Core.Extensions;
using Pims.Keycloak.Extensions;

namespace Pims.Keycloak
{
    /// <summary>
    /// KeycloakAdmin class, provides a service for sending HTTP requests to the keycloak admin API.
    ///     - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_overview
    /// </summary>
    public partial class KeycloakService : IKeycloakService
    {
        #region Methods
        #region By ID
        /// <summary>
        /// Get the role for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> GetRoleAsync(Guid id)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles-by-id/{id}");

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Update the specified role.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> UpdateRoleAsync(Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PutAsync($"{this.Options.Admin.Authority}/roles-by-id/{role.Id}", content);

            return response.HandleResponse(role);
        }

        /// <summary>
        /// Delete the specified role.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Guid> DeleteRoleAsync(Guid id)
        {
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/roles-by-id/{id}");

            return response.HandleResponse(id);
        }

        /// <summary>
        /// Create a new composite role.
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> CreateCompositeRolesAsync(Guid parentId, Models.RoleModel[] roles)
        {
            var json = roles.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/roles-by-id/{parentId}/composites", content);

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of composite roles for the parent role with the specified 'parentId'.
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetCompositeRolesAsync(Guid parentId)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles-by-id/{parentId}/composites");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Delete the composite roles for the parent role with the specified 'parentId'.
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> DeleteCompositeRolesAsync(Guid parentId, Models.RoleModel[] roles)
        {
            var json = roles.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/roles-by-id/{parentId}/composites", content);

            return response.HandleResponse(roles);
        }

        /// <summary>
        /// Get an array of composite roles for the parent with the specified 'parentId' within the client for the specified 'clientName'.
        /// </summary>
        /// <param name="parentId"></param>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetClientCompositeRolesAsync(Guid parentId, string clientName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles-by-id/{parentId}/composites/clients/{clientName}");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of composite roles for the parent with the specified 'parentId' within the realm.
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetRealmCompositeRolesAsync(Guid parentId)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles-by-id/{parentId}/composites/realm");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }
        #endregion

        #region Realm
        /// <summary>
        /// Get an array of realm roles.
        /// </summary>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetRolesAsync()
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get the realm role for the specified 'name'.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> GetRoleAsync(string name)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles/{name}");

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Create a new realm role.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> CreateRoleAsync(Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/roles", content);

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Update the realm role for the specified 'name'.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> UpdateRoleAsync(string name, Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PutAsync($"{this.Options.Admin.Authority}/roles/{name}", content);

            return response.HandleResponse(role);
        }

        /// <summary>
        /// Delete the realm role for the specified 'name'.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<string> DeleteRoleAsync(string name)
        {
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/roles/{name}");

            return response.HandleResponse(name);
        }

        /// <summary>
        /// Create a composite realm role for the parent with the specified 'parentName'.
        /// </summary>
        /// <param name="parentName"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> CreateCompositeRoleAsync(string parentName, Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/roles/{parentName}/composites", content);

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Get an array of composite realm roles for the specified 'parentName'.
        /// </summary>
        /// <param name="parentName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetCompositeRolesAsync(string parentName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles/{parentName}/composites");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Delete the composite realm roles for the specified 'parentName'.
        /// </summary>
        /// <param name="parentName"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> DeleteCompositeRoleAsync(string parentName, Models.RoleModel[] roles)
        {
            var json = roles.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/roles/{parentName}/composites", content);

            return response.HandleResponse(roles);
        }

        /// <summary>
        /// Get an array of client composite roles for the parent role specified by the 'parentName' and the client specified by the 'clientName'.
        /// </summary>
        /// <param name="parentName"></param>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetClientCompositeRolesAsync(string parentName, string clientName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles/{parentName}/composites/clients/{clientName}");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of realm composite roles for the parent specified by the 'parentName'.
        /// </summary>
        /// <param name="parentName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetRealmCompositeRolesAsync(string parentName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles/{parentName}/composites/realm");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of users that belong to role for the specified 'name'.
        /// This method support paging.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="first"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public async Task<Models.UserModel[]> GetRoleMembersAsync(string name, int first = 0, int max = 10)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/roles/{name}/users?first={first}&max={max}");

            return await response.HandleResponseAsync<Models.UserModel[]>();
        }
        #endregion

        #region Client
        /// <summary>
        /// Get an array of roles for the client specified by the 'clientId'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetRolesAsync(Guid clientId)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get the role specified by the 'name', within the client specified by the 'clientId'
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> GetRoleAsync(Guid clientId, string name)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{name}");

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Create a new role within the client specified by the 'clientId'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> CreateRoleAsync(Guid clientId, Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles", content);

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Update the role within the client specified by the 'clientId'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> UpdateRoleAsync(Guid clientId, Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PutAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{role.Name}", content);

            return response.HandleResponse(role);
        }

        /// <summary>
        /// Delete the role specified by the 'name' within the client specified by the 'clientId'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<string> DeleteRoleAsync(Guid clientId, string name)
        {
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{name}");

            return response.HandleResponse(name);
        }

        /// <summary>
        /// Create a new composite role within the client specified by the 'clientId', the belongs to the role specified by the 'parentName'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <param name="role"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel> CreateCompositeRoleAsync(Guid clientId, string parentName, Models.RoleModel role)
        {
            var json = role.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/composites", content);

            return await response.HandleResponseAsync<Models.RoleModel>();
        }

        /// <summary>
        /// Get an array of composite roles
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetCompositeRolesAsync(Guid clientId, string parentName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/composites");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Delete composite roles within the client specified by the 'clientId', that belong to the parent role specified by the 'parentName'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <param name="roles"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> DeleteCompositeRoleAsync(Guid clientId, string parentName, Models.RoleModel[] roles)
        {
            var json = roles.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/composites", content);

            return response.HandleResponse(roles);
        }

        /// <summary>
        /// Get an array of composite roles within the client specified by the 'clientId', that belong to the parent role specified by the 'parentName'
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetClientCompositeRolesAsync(Guid clientId, string parentName, string clientName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/composites/clients/{clientName}");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of composite roles within the client specified by the 'clientId', that belong to the parent role specified by the 'parentName'
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <returns></returns>
        public async Task<Models.RoleModel[]> GetRealmCompositeRolesAsync(Guid clientId, string parentName)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/composites/realm");

            return await response.HandleResponseAsync<Models.RoleModel[]>();
        }

        /// <summary>
        /// Get an array of users who are within the client specified by the 'clientId', that belong to the parent role specified by the 'parentName'.
        /// </summary>
        /// <param name="clientId"></param>
        /// <param name="parentName"></param>
        /// <param name="first"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public async Task<Models.UserModel[]> GetRoleMembersAsync(Guid clientId, string parentName, int first = 0, int max = 10)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/clients/{clientId}/roles/{parentName}/users?first={first}&max={max}");

            return await response.HandleResponseAsync<Models.UserModel[]>();
        }
        #endregion
        #endregion
    }
}
