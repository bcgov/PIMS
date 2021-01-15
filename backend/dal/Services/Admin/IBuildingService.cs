using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingService interface, provides a service layer to administer buildings within the datasource.
    /// </summary>
    public interface IBuildingService : IBaseService<Building>
    {
        Paged<Building> Get(int page, int quantity, string sort);
        Building Get(int id);
        IEnumerable<Building> GetByPid(int pid, string name = null);
        IEnumerable<Building> GetByPidWithoutTracking(int pid, string name = null);
        IEnumerable<Building> GetByName(string name);
        IEnumerable<Building> GetByNameWithoutTracking(string name);

        void LoadParcelsFor(Building building);
        IEnumerable<Building> Add(IEnumerable<Building> buildings);
        void UpdateFinancials(Building building);
    }
}
