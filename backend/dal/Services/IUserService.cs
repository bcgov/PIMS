using System;
using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IUserService interface, provides functions to interact with users within the datasource.
    /// </summary>
    public interface IUserService : IService
    {
        bool UserExists(Guid id);
        User Activate();
        IEnumerable<int> GetAgencies(Guid userId);
        AccessRequest GetAccessRequest();
        AccessRequest GetAccessRequest(int id);
        AccessRequest DeleteAccessRequest(AccessRequest accessRequest);
        AccessRequest AddAccessRequest(AccessRequest request);
        AccessRequest UpdateAccessRequest(AccessRequest request);
    }
}
