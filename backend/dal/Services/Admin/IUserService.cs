using System;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IUserService interface, provides a service layer to administer users within the datasource.
    /// </summary>
    public interface IUserService : IBaseService<User>
    {
        Paged<User> Get(int page = 1, int quantity = 10);
        Paged<User> Get(UserFilter filter);
        User Get(Guid id);

        AccessRequest UpdateAccessRequest(AccessRequest entity);
        AccessRequest GetAccessRequest(Guid id);
        Paged<AccessRequest> GetAccessRequests(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null);
    }
}
