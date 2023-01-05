using Pims.Dal.Entities;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IUserService interface, provides functions to interact with users within the datasource.
    /// </summary>
    public interface IUserService : IService
    {
        bool UserExists(Guid KeycloakUserId);
        bool UserExists(string username);
        User GetUserForUsername(string username);
        User GetUserForKeycloakId(Guid keycloakUserId);
        User Activate();
        IEnumerable<int> GetAgencies(Guid userId);
        IEnumerable<int> GetAgencies(string username);
        IEnumerable<int> GetUsersAgencies(Guid id);
        AccessRequest GetAccessRequest();
        AccessRequest GetAccessRequest(int id);
        AccessRequest DeleteAccessRequest(AccessRequest accessRequest);
        AccessRequest AddAccessRequest(AccessRequest request);
        AccessRequest UpdateAccessRequest(AccessRequest request);
        IEnumerable<User> GetAdmininstrators(params int[] agencyId);
    }
}
