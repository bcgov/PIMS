using System;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IRoleService interface, provides a service layer to administer roles within the datasource.
    /// </summary>
    public interface IRoleService : IBaseService<Role>
    {
        Paged<Role> Get(int page, int quantity, string name = null);
        Role Get(Guid id);
        Role GetByName(string name);
        Role GetByKeycloakId(Guid id);
        int RemoveAll(Guid[] exclude);
    }
}
