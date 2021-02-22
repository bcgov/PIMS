using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System;

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
        User Get(Guid id);

        AccessRequest UpdateAccessRequest(AccessRequest accessRequest);
        AccessRequest GetAccessRequest(int id);
        Paged<AccessRequest> GetAccessRequests(int page = 1, int quantity = 10, string sort = null,
            AccessRequestStatus status = AccessRequestStatus.OnHold);
        Paged<AccessRequest> GetAccessRequests(AccessRequestFilter filter);
    }
}
