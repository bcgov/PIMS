using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ITierLevelService interface, provides a service layer to administer tier levels within the datasource.
    /// </summary>
    public interface ITierLevelService : IBaseService<TierLevel>
    {
        IEnumerable<TierLevel> GetAll();
        TierLevel Get(int id);
    }
}
