using System;
using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IUserService interface, provides a service layer to administer users within the datasource.
    /// </summary>
    public interface IUserService : IBaseService<User>
    {
        Paged<User> GetNoTracking(int page, int quantity, string sort);
        User GetNoTracking(Guid id);
    }
}
