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
        Paged<User> GetNoTracking(int page = 1, int quantity = 10);
        Paged<User> GetNoTracking(UserFilter filter);
        User GetNoTracking(Guid id);
        User Get(Guid id);

        AccessRequest UpdateAccessRequest(AccessRequest entity);
        AccessRequest GetAccessRequestNoTracking(Guid id);
        Paged<AccessRequest> GetAccessRequestsNoTracking(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null);
    }
}
