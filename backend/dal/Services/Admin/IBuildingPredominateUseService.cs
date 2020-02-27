using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingPredominateUseService interface, provides a service layer to administer building predominate uses types within the datasource.
    /// </summary>
    public interface IBuildingPredominateUseService : IBaseService<BuildingPredominateUse>
    {
        IEnumerable<BuildingPredominateUse> GetAllNoTracking();
        IEnumerable<BuildingPredominateUse> GetAll();
    }
}
