using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Comparers;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.IdentityModel.Tokens.Jwt;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// UserService class, provides a service layer to administrate users within the datasource.
    /// </summary>
    public class UserService : BaseService<User>, IUserService
    {
        private IConfiguration configuration;
        #region Variables
        private string access_token = "";

        private readonly ILogger<UserService> _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<UserService> logger, IConfiguration configuration) : base(dbContext, user, service, logger)
        {
            this.configuration = configuration;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get the total number of user accounts.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return this.Context.Users.Count();
        }

        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for anything that starts with the following properties; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public Paged<User> Get(int page, int quantity)
        {
            return Get(new UserFilter(page, quantity));
        }

        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for the following property values; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<User> Get(UserFilter filter = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var query = this.Context.Users
                .Include(u => u.Agencies).ThenInclude(a => a.Agency)
                .Include(u => u.Roles).ThenInclude(r => r.Role)
                .Include(u => u.CreatedBy)
                .Include(u => u.UpdatedBy)
                .Include(u => u.ApprovedBy)
                .AsNoTracking()
                .Where(u => !u.IsSystem);

            IEnumerable<int> userAgencies = this.Self.User.GetAgencies(this.User.GetUsername());
            if (userAgencies != null && User.HasPermission(Permissions.AgencyAdmin) && !User.HasPermission(Permissions.SystemAdmin))
            {
                query = query.Where(user => user.Agencies.Any(a => userAgencies.Contains(a.AgencyId)));
            }

            if (filter != null)
            {
                if (filter.Page < 1) filter.Page = 1;
                if (filter.Quantity < 1) filter.Quantity = 1;
                if (filter.Sort == null) filter.Sort = new string[] { };

                if (!string.IsNullOrWhiteSpace(filter.Username))
                    query = query.Where(u => EF.Functions.Like(u.Username, $"%{filter.Username}%"));
                if (!string.IsNullOrWhiteSpace(filter.DisplayName))
                    query = query.Where(u => EF.Functions.Like(u.DisplayName, $"%{filter.DisplayName}%"));
                if (!string.IsNullOrWhiteSpace(filter.FirstName))
                    query = query.Where(u => EF.Functions.Like(u.FirstName, $"%{filter.FirstName}%"));
                if (!string.IsNullOrWhiteSpace(filter.LastName))
                    query = query.Where(u => EF.Functions.Like(u.LastName, $"%{filter.LastName}%"));
                if (!string.IsNullOrWhiteSpace(filter.Email))
                    query = query.Where(u => EF.Functions.Like(u.Email, $"%{filter.Email}%"));
                if (!string.IsNullOrWhiteSpace(filter.Position))
                    query = query.Where(u => EF.Functions.Like(u.Position, $"%{filter.Position}%"));
                if (filter.IsDisabled != null)
                    query = query.Where(u => u.IsDisabled == filter.IsDisabled);
                if (!string.IsNullOrWhiteSpace(filter.Role))
                    query = query.Where(u => u.Roles.Any(r =>
                        EF.Functions.Like(r.Role.Name, $"%{filter.Role}")));
                if (!string.IsNullOrWhiteSpace(filter.Agency))
                    query = query.Where(u => u.Agencies.Any(a =>
                        EF.Functions.Like(a.Agency.Name, $"%{filter.Agency}") || EF.Functions.Like(a.Agency.Parent.Name, $"%{filter.Agency}")));

                if (filter.Sort.Any())
                {
                    if (filter.Sort[0].StartsWith("Agency"))
                    {
                        var direction = filter.Sort[0].Split(" ")[1];
                        query = direction == "asc" ?
                            query.OrderBy(u => u.Agencies.Any() ? u.Agencies.FirstOrDefault().Agency.Name : null)
                            : query.OrderByDescending(u => u.Agencies.Any() ? u.Agencies.FirstOrDefault().Agency.Name : null);
                    }
                    else
                    {
                        query = query.OrderByProperty(filter.Sort);

                    }

                }
            }
            var users = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<User>(users.ToArray(), filter.Page, filter.Quantity, query.Count());
        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public GoldUser Get(Guid id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var user = this.Context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == id);

            if (user == null) throw new KeyNotFoundException();
            GoldUser gUser = new GoldUser(user);
            string identityProvider = gUser.Username.Split("@").Last();

            if (identityProvider == "idir")
            {
                try
                {
                    string preferred_username = GetUsersPreferredUsername(gUser.Email, identityProvider).Result;
                    gUser.GoldUserRoles = GetGoldUsersRolesAsync(preferred_username).Result;
                }
                catch
                {
                    return gUser;
                }


            }
            else if (identityProvider.Contains("bceid"))
            {
                try
                {
                    string preferred_username = GetUsersPreferredUsername(gUser.KeycloakUserId ?? Guid.Empty, identityProvider).Result;
                    gUser.GoldUserRoles = GetGoldUsersRolesAsync(preferred_username).Result;
                }
                catch
                {
                    return gUser;
                }

            }
            return gUser;

        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public GoldUser Get(string username)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var user = this.Context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .AsNoTracking()
                .SingleOrDefault(u => u.Username == username);

            if (user == null) throw new KeyNotFoundException();
            GoldUser gUser = new GoldUser(user);
            string preferred_username = GetUsersPreferredUsername(gUser.KeycloakUserId ?? Guid.Empty, gUser.Username.Split("@").Last()).Result;
            gUser.GoldUserRoles = GetGoldUsersRolesAsync(preferred_username).Result;
            return gUser;

        }

        /// <summary>
        /// Get the user with the specified 'keycloakUserId'.
        /// </summary>
        /// <param name="keycloakUserId"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public User GetForKeycloakUserId(Guid keycloakUserId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            return this.Context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .AsNoTracking()
                .SingleOrDefault(u => u.KeycloakUserId == keycloakUserId) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add the specified user to the datasource.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public override void Add(User user)
        {
            user.ThrowIfNull(nameof(user));

            user.Roles.ForEach(r => this.Context.Entry(r).State = EntityState.Added);
            user.Agencies.ForEach(a => this.Context.Entry(a).State = EntityState.Added);

            base.Add(user);
            this.Context.Detach(user);
        }

        /// <summary>
        /// Updates the specified user in the datasource.
        /// </summary>
        /// <param name="user"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(User user)
        {
            user.ThrowIfNull(nameof(user));

            var existingUser = this.Context.Users
                .Include(u => u.Agencies)
                .Include(u => u.Roles)
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == user.Id) ?? throw new KeyNotFoundException();

            this.Context.SetOriginalRowVersion(existingUser);

            //This is bad, but it's such an edge case where it would cause a big issue...
            user.RowVersion = existingUser.RowVersion;

            if (!existingUser.Agencies.Any())
            {
                var username = this.User.GetUsername();
                user.ApprovedById = this.Context.Users.Where(u => u.Username == username).Select(u => u.Id).FirstOrDefault();
                user.ApprovedOn = DateTime.UtcNow;
            }
            GoldUser gUser = this.Get(this.User.GetUsername());

            var addRoles = user.Roles.Except(existingUser.Roles, new UserRoleRoleIdComparer()); //gUser.GoldUserRoles; //.Except(user.Roles, new UserRoleRoleIdComparer());
            addRoles.ForEach(r => this.Context.Entry(r).State = EntityState.Added);
            var removeRoles = existingUser.Roles.Except(user.Roles, new UserRoleRoleIdComparer());
            removeRoles.ForEach(r => this.Context.Entry(r).State = EntityState.Deleted);

            var addAgencies = user.Agencies.Except(existingUser.Agencies, new UserAgencyAgencyIdComparer());
            addAgencies.ForEach(a => this.Context.Entry(a).State = EntityState.Added);
            var removeAgencies = existingUser.Agencies.Except(user.Agencies, new UserAgencyAgencyIdComparer());
            removeAgencies.ForEach(a => this.Context.Entry(a).State = EntityState.Deleted);

            user.ApprovedById = existingUser.ApprovedById;
            user.ApprovedOn = existingUser.ApprovedOn;
            user.CreatedById = existingUser.CreatedById;
            user.CreatedOn = existingUser.CreatedOn;
            user.LastLogin = existingUser.LastLogin;

            base.Update(user);
            this.Context.Detach(user);
        }

        /// <summary>
        /// Remove the specified user from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="user"></param>
        public override void Remove(User user)
        {
            user.ThrowIfNull(nameof(user));

            var existingUser = this.Context.Users
                .Include(u => u.Agencies)
                .Include(u => u.Roles)
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == user.Id) ?? throw new KeyNotFoundException();

            this.Context.SetOriginalRowVersion(existingUser);

            existingUser.Roles.Clear();
            existingUser.Agencies.Clear();

            base.Remove(existingUser);
        }

        /// <summary>
        /// Get all of the given user's roles from keycloak
        /// </summary>
        /// <param name="preferred_username"></param>
        public async Task<IEnumerable<string>> GetGoldUsersRolesAsync(string preferred_username)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            // Keycloak Gold only wants the clientID as a number, which is always at the end of the id, after a "-"
            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, this.configuration["Keycloak:BaseURL"] + $"integrations/{frontendId}/{getEnv()}/users/{preferred_username}/roles");
            _logger.LogDebug($"Test Logging the request to Keycloak '{request}'");

            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to fetch roles from Keycloak Gold");
            string payload = await response.Content.ReadAsStringAsync();
            JsonDocument json = JsonDocument.Parse(payload);

            _logger.LogDebug($"Test Logging the response from Keycloak '{json.RootElement.ToString()}'");
            IEnumerable<string> roles = json.RootElement.GetProperty("data").EnumerateArray().Select(r => r.GetProperty("name").GetString());
            _logger.LogDebug($"Test Logging the Keycloak roles: '{string.Join(", ", roles)}'");

            return roles;
        }

        /// <summary>
        /// Get the given user's preferred username, which is required for subsequent Keycloak Gold API calls
        /// </summary>
        /// <param name="email"></param>
        /// <param name="identityProvider">Rather @idir or @bceid</param>
        public async Task<string> GetUsersPreferredUsername(Guid keycloakGuid, string identityProvider)
        {
            string idp = identityProvider == "idir" ? "idir" : "basic-business-bceid";
            string guid = keycloakGuid.ToString().Replace("-", "");
            _logger.LogDebug($"Test Logging the Keycloak guid '{guid}'");

            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            // Keycloak Gold only wants the clientID as a number, which is always at the end of the id, after a "-"
            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"https://api.loginproxy.gov.bc.ca/api/v1/{getEnv()}/{idp}/users?guid={guid}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to get user's username from Keycloak Gold");
            string payload = await response.Content.ReadAsStringAsync();

            JsonDocument json = JsonDocument.Parse(payload);
            JsonElement dataElement = json.RootElement.GetProperty("data");

            _logger.LogDebug($"Test Logging response object Keycloak '{dataElement}'");
            // handle the potential empty sequence:
            if (dataElement.EnumerateArray().Any())
            {
                string username = dataElement.EnumerateArray().First().GetProperty("username").GetString();
                _logger.LogDebug($"Test Logging Keycloak reponse for username '{username}'");
                return username;
            }
            else
            {
                // Handle the case where the "data" array is empty.
                _logger.LogDebug($"Test Logging Keycloak reponse was an empty array '{dataElement}'");
                throw new Exception("No user data found in the response from Keycloak Gold");
            }
        }

        /// <summary>
        /// Get the given user's preferred username, which is required for subsequent Keycloak Gold API calls
        /// </summary>
        /// <param name="email"></param>
        /// <param name="identityProvider">Rather @idir or @bceid</param>
        public async Task<string> GetUsersPreferredUsername(string email, string identityProvider)
        {
            string idp = identityProvider == "idir" ? "idir" : "basic-business-bceid";

            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            // Keycloak Gold only wants the clientID as a number, which is always at the end of the id, after a "-"
            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"https://api.loginproxy.gov.bc.ca/api/v1/{getEnv()}/{idp}/users?email={email}");
            _logger.LogDebug($"Test Logging the request for username to Keycloak '{request}'");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to get user's username from Keycloak Gold");
            string payload = await response.Content.ReadAsStringAsync();

            JsonDocument json = JsonDocument.Parse(payload);
            _logger.LogDebug($"Test Logging the response for username from Keycloak '{json.RootElement.ToString()}'");
            string username = json.RootElement.GetProperty("data").EnumerateArray().First().GetProperty("username").GetString();

            return username;
        }

        /// <summary>
        /// Update user's roles in Keycloak, given an array of role names
        /// </summary>
        /// <param name="preferred_username"></param>
        /// <param name="roles"></param>
        public async Task<string> UpdateGoldRolesAsync(string preferred_username, IEnumerable<string> roles)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, this.configuration["Keycloak:BaseURL"] + $"integrations/{frontendId}/{getEnv()}/users/{preferred_username}/roles");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            var serializableRoles = roles.Select(role => new { name = role });
            string json = JsonSerializer.Serialize(serializableRoles);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to update roles in Keycloak Gold");

            // JObject payload = JObject.Parse(await response.Content.ReadAsStringAsync());

            return response.Content.ReadAsStringAsync().Result;
        }

        /// <summary>
        /// Get user roles from Keycloak
        /// </summary>
        public async Task<IEnumerable<string>> GetRolesAsync()
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, this.configuration["Keycloak:BaseURL"] + $"integrations/{frontendId}/{getEnv()}/roles");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to get roles from Keycloak Gold");
            string payload = await response.Content.ReadAsStringAsync();

            JsonDocument json = JsonDocument.Parse(payload);
            IEnumerable<string> roles = json.RootElement.GetProperty("data").EnumerateArray().Select(r => r.GetProperty("name").GetString());

            return roles;
        }

        /// <summary>
        /// Add a role to the given user in Keycloak Gold
        /// </summary>
        /// <param name="preferred_username"></param>
        /// <param name="roleName"></param>
        public async Task<string> AddRoleToUser(string preferred_username, string roleName)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, this.configuration["Keycloak:BaseURL"] + $"integrations/{frontendId}/{getEnv()}/users/{preferred_username}/roles");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            var serializableRole = new object[] { new { name = roleName } };
            string json = JsonSerializer.Serialize(serializableRole);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to add role in Keycloak Gold");

            // JObject payload = JObject.Parse(await response.Content.ReadAsStringAsync());

            return response.Content.ReadAsStringAsync().Result;
        }

        /// <summary>
        /// Delete a role for the given user in Keycloak Gold
        /// </summary>
        /// <param name="preferred_username"></param>
        /// <param name="roles"></param>
        public async Task<string> DeleteRoleFromUser(string preferred_username, string roleName)
        {
            // TODO: Iterate on the following to make this D.R.Y.
            HttpClient _httpClient = new HttpClient();
            string token = await GetToken();

            string frontendId = this.configuration["Keycloak:FrontendClientId"].Split("-").Last();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, this.configuration["Keycloak:BaseURL"] + $"integrations/{frontendId}/{getEnv()}/users/{preferred_username}/roles/{roleName}");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to delete role from user in Keycloak Gold");

            return response.Content.ReadAsStringAsync().Result;
        }

        private string getEnv()
        {
            string envName = this.configuration["Pims:Environment:Name"];

            if (envName == "Production")
            {
                return "prod";
            }
            else if (envName == "Testing")
            {
                return "test";
            }
            else
            {
                return "dev";
            }

        }


        /// <summary>
        /// Get an access token for the Keycloak Gold API
        /// </summary>
        public async Task<string> GetToken()
        {
            if (isTokenValid(this.access_token)) return this.access_token;

            HttpClient _httpClient = new HttpClient();
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "https://api.loginproxy.gov.bc.ca/api/v1/token");
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    {"client_id", this.configuration["Keycloak:ServiceAccount:Client"]},
                    {"client_secret", this.configuration["Keycloak:ServiceAccount:Secret"]},
                    {"grant_type", "client_credentials"}
                });
            request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded");
            HttpResponseMessage response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) throw new Exception("Unable to get token from Keycloak Gold");
            JsonNode payload = JsonNode.Parse(await response.Content.ReadAsStringAsync());
            string token = payload["access_token"].ToString();
            this.access_token = token;
            return token;
        }
        /// <summary>
        /// Tests the validity of a JWT
        /// </summary>
        /// <param name="token"></param>
        private bool isTokenValid(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var decodedToken = handler.ReadJwtToken(this.access_token);
                return decodedToken.ValidTo >= DateTime.UtcNow;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Update the database using the passed AccessRequest
        /// </summary>
        /// <param name="accessRequest"></param>
        public AccessRequest UpdateAccessRequest(AccessRequest accessRequest)
        {
            var existingAccessRequest = GetAccessRequest(accessRequest.Id);
            this.Context.SetOriginalRowVersion(existingAccessRequest);

            var isApproving = accessRequest.Status == AccessRequestStatus.Approved && existingAccessRequest.Status != AccessRequestStatus.Approved;

            existingAccessRequest.Note = accessRequest.Note;
            existingAccessRequest.Status = accessRequest.Status;
            existingAccessRequest.Roles.Clear();
            accessRequest.Roles.ForEach(r => existingAccessRequest.Roles.Add(new AccessRequestRole(existingAccessRequest.Id, r.RoleId)));
            existingAccessRequest.Agencies.Clear();
            accessRequest.Agencies.ForEach(a => existingAccessRequest.Agencies.Add(new AccessRequestAgency(existingAccessRequest.Id, a.AgencyId)));

            if (isApproving)
            {
                var approvedUser = this.Context.Users.Find(existingAccessRequest.UserId);
                string username = this.User.GetUsername();
                approvedUser.ApprovedById = this.Context.Users.Where(u => u.Username == username).Select(u => u.Id).FirstOrDefault();
                approvedUser.ApprovedOn = DateTime.UtcNow;
                this.Context.Users.Update(approvedUser);
            }

            Context.Entry(existingAccessRequest).State = EntityState.Modified;
            this.Context.CommitTransaction();
            return accessRequest;
        }

        /// <summary>
        /// Get the access request with matching id
        /// </summary>
        /// <param name="id"></param>
        public AccessRequest GetAccessRequest(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            return this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking()
                .Where(ar => ar.Id == id)
                .FirstOrDefault() ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get all the access requests that users have submitted to the system
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="status"></param>
        public Paged<AccessRequest> GetAccessRequests(int page = 1, int quantity = 10, string sort = null,
            AccessRequestStatus status = AccessRequestStatus.OnHold)
        {
            var sortArray = !string.IsNullOrWhiteSpace(sort) ? new[] { sort } : new string[0];
            var filter = new AccessRequestFilter(page, quantity, sortArray, null, null, null, status);
            return GetAccessRequests(filter);
        }

        /// <summary>
        /// Get all the access requests that users have match the specified filter
        /// </summary>
        /// <param name="filter"></param>
        public Paged<AccessRequest> GetAccessRequests(AccessRequestFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var query = this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking();

            IEnumerable<int> userAgencies = this.Self.User.GetAgencies(this.User.GetUsername());
            if (userAgencies != null && User.HasPermission(Permissions.AgencyAdmin) && !User.HasPermission(Permissions.SystemAdmin))
            {
                query = query.Where(accessRequest => accessRequest.Agencies.Any(a => userAgencies.Contains(a.AgencyId)));
            }

            query = query.Where(request => request.Status == filter.Status);

            if (!string.IsNullOrWhiteSpace(filter.Role))
                query = query.Where(ar => ar.Roles.Any(r =>
                    EF.Functions.Like(r.Role.Name, $"%{filter.Role}%")));

            if (!string.IsNullOrWhiteSpace(filter.Agency))
                query = query.Where(ar => ar.Agencies.Any(a =>
                    EF.Functions.Like(a.Agency.Name, $"%{filter.Agency}%")));

            if (!string.IsNullOrWhiteSpace(filter.SearchText))
            {
                query = query.Where(ar => EF.Functions.Like(ar.User.Username, $"%{filter.SearchText}%"));
            }

            var accessRequests = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<AccessRequest>(accessRequests, filter.Page, filter.Quantity, query.Count());
        }

        #endregion
    }
}
