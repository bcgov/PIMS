using System.Linq;
using System.Globalization;
using Newtonsoft.Json.Linq;
using Pims.Core.Extensions;
using Pims.Keycloak.Extensions;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

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

        public async Task<string> GetGoldUsersRolesAsync(string preferred_username)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            // Keycloak Gold only wants the clientID as a number, which is always at the end of the id, after a "-"
            string frontendId = this.Options.FrontendClientId.Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"https://api.loginproxy.gov.bc.ca/api/v1/integrations/{frontendId}/dev/users/{preferred_username}/roles");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            // JObject payload = JObject.Parse(await response.Content.ReadAsStringAsync());

            return response.Content.ReadAsStringAsync().Result;
        }

        public async Task<string> UpdateGoldRolesAsync(string preferred_username, string RoleName)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            string frontendId = this.Options.FrontendClientId.Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, $"https://api.loginproxy.gov.bc.ca/api/v1/integrations/{frontendId}/dev/users/{preferred_username}/roles");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(new List<Dictionary<string, string>>() {
                new Dictionary<string, string>() { { "name", RoleName } }
            });
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            // JObject payload = JObject.Parse(await response.Content.ReadAsStringAsync());

            return response.Content.ReadAsStringAsync().Result;
        }

        private async Task<string> GetToken()
        {
            HttpClient _httpClient = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "https://api.loginproxy.gov.bc.ca/api/v1/token");
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    {"client_id", this.Options.ServiceAccount.Client},
                    {"client_secret", this.Options.ServiceAccount.Secret},
                    {"grant_type", "client_credentials"}
                });
            request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded");
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            JObject payload = JObject.Parse(await response.Content.ReadAsStringAsync());
            string token = payload.Value<string>("access_token");
            return token;
        }

        #endregion
    }
}
