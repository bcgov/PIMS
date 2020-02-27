using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingService interface, provides a service layer to administer buildings within the datasource.
    /// </summary>
    public interface IBuildingService : IBaseService<Building>
    {
        Paged<Building> GetNoTracking(int page, int quantity, string sort);
        Building GetNoTracking(int id);
        Building GetByLocalIdNoTracking(string localId);
        Building Get(int id);
        Building GetByLocalId(string localId);
        Building GetByPidAndLocalId(int pid, string localId);
        IEnumerable<Building> Add(IEnumerable<Building> buildings);
    }
}
