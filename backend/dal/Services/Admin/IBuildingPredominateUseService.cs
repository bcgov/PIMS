using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IBuildingPredominateUseService interface, provides a service layer to administer building predominate uses types within the datasource.
    /// </summary>
    public interface IBuildingPredominateUseService : IBaseService<BuildingPredominateUse>
    {
        IEnumerable<BuildingPredominateUse> GetAll();
    }
}
