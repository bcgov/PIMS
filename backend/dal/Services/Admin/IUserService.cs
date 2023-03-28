using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IUserService interface, provides a service layer to administer users within the datasource.
    /// </summary>
    public interface IUserService : IBaseService<User>
    {
        int Count();
        Paged<User> Get(int page, int quantity);
        Paged<User> Get(UserFilter filter);
        GoldUser Get(Guid id);
        GoldUser Get(string username);
        User GetForKeycloakUserId(Guid keycloakUserId);
        Task<IEnumerable<string>> GetGoldUsersRolesAsync(string preferred_username);
        Task<IEnumerable<string>> GetRolesAsync();
        Task<string> GetUsersPreferredUsername(Guid keycloakGuid, string identityProvider);
        Task<string> GetUsersPreferredUsername(string email, string identityProvider);
        Task<string> UpdateGoldRolesAsync(string preferred_username, IEnumerable<string> roles);
        Task<string> AddRoleToUser(string preferred_username, string roleName);
        Task<string> DeleteRoleFromUser(string preferred_username, string roleName);

        AccessRequest UpdateAccessRequest(AccessRequest accessRequest);
        AccessRequest GetAccessRequest(int id);
        Paged<AccessRequest> GetAccessRequests(int page = 1, int quantity = 10, string sort = null, AccessRequestStatus status = AccessRequestStatus.OnHold);
        Paged<AccessRequest> GetAccessRequests(AccessRequestFilter filter);
    }
}
