using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingConstructionTypeService interface, provides a service layer to administer building construction types within the datasource.
    /// </summary>
    public interface IBuildingConstructionTypeService : IBaseService<BuildingConstructionType>
    {
        IEnumerable<BuildingConstructionType> GetAll();
    }
}
