using System;
using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IRoleService interface, provides a service layer to administer roles within the datasource.
    /// </summary>
    public interface IRoleService : IBaseService<Role>
    {
        Paged<Role> GetNoTracking(int page, int quantity);
        Role GetNoTracking(Guid id);
        Role GetByName(string name);
    }
}
