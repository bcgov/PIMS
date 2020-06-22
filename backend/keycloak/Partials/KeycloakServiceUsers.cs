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
        /// <summary>
        /// Get the total number of users.
        /// </summary>
        /// <returns></returns>
        public async Task<int> GetUserCountAsync()
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/users/count");
            var result = await response.HandleResponseAsync<Models.CountModel>();

            return result.Count;
        }

        /// <summary>
        /// Get an array of users.
        /// This function supports paging.
        /// </summary>
        /// <param name="first"></param>
        /// <param name="max"></param>
        /// <param name="search"></param>
        /// <returns></returns>
        public async Task<Models.UserModel[]> GetUsersAsync(int first = 0, int max = 10, string search = null)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/users?first={first}&max={max}&search={search}");

            return await response.HandleResponseAsync<Models.UserModel[]>();
        }

        /// <summary>
        /// Get the user for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Models.UserModel> GetUserAsync(Guid id)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/users/{id}");

            return await response.HandleResponseAsync<Models.UserModel>();
        }

        /// <summary>
        /// Create a new user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<Models.UserModel> CreateUserAsync(Models.UserModel user)
        {
            var json = user.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{this.Options.Admin.Authority}/users", content);

            return await response.HandleResponseAsync<Models.UserModel>();
        }

        /// <summary>
        /// Update the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<Guid> UpdateUserAsync(Models.UserModel user)
        {
            var json = user.Serialize();
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PutAsync($"{this.Options.Admin.Authority}/users/{user.Id}", content);

            return response.HandleResponse(user.Id);
        }

        /// <summary>
        /// Delete the user for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Guid> DeleteUserAsync(Guid id)
        {
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/users/{id}");

            return response.HandleResponse(id);
        }

        /// <summary>
        /// Get an array of the groups the user for the specified 'id' is a member of.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Models.GroupModel[]> GetUserGroupsAsync(Guid id)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/users/{id}/groups");

            return await response.HandleResponseAsync<Models.GroupModel[]>();
        }

        /// <summary>
        /// Get the total number of groups the user for the specified 'id' is a member of.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<int> GetUserGroupCountAsync(Guid id)
        {
            var response = await _client.GetAsync($"{this.Options.Admin.Authority}/users/{id}/groups/count");

            return await response.HandleResponseAsync<int>();
        }

        /// <summary>
        /// Add the user to the group for the specified 'userId' and 'groupId'.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public async Task<Guid> AddGroupToUserAsync(Guid userId, Guid groupId)
        {
            var response = await _client.PutAsync($"{this.Options.Admin.Authority}/users/{userId}/groups/{groupId}");

            return response.HandleResponse(userId);
        }

        /// <summary>
        /// Remove the user from the group for the specified 'userId' and 'groupId'.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public async Task<Guid> RemoveGroupFromUserAsync(Guid userId, Guid groupId)
        {
            var response = await _client.DeleteAsync($"{this.Options.Admin.Authority}/users/{userId}/groups/{groupId}");

            return response.HandleResponse(userId);
        }
        #endregion
    }
}
