using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IAgencyService interface, provides a service layer to administer agencies within the datasource.
    /// </summary>
    public interface IAgencyService : IBaseService<Agency>
    {
        IEnumerable<Agency> GetAll();
        Agency Get(int id);
        Paged<Agency> Get(int page, int quantity);
        Paged<Agency> Get(AgencyFilter filter);
    }
}
