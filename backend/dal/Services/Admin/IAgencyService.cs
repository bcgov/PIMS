using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IAgencyService interface, provides a service layer to administer agencies within the datasource.
    /// </summary>
    public interface IAgencyService : IBaseService<Agency>
    {
        IEnumerable<Agency> GetAll();
    }
}
