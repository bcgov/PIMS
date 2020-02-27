using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingConstructionTypeService interface, provides a service layer to administer building construction types within the datasource.
    /// </summary>
    public interface IBuildingConstructionTypeService : IBaseService<BuildingConstructionType>
    {
        IEnumerable<BuildingConstructionType> GetAllNoTracking();
        IEnumerable<BuildingConstructionType> GetAll();
    }
}
