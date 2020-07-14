using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ICityService interface, provides a service layer to administer cities within the datasource.
    /// </summary>
    public interface ICityService : IBaseService<City>
    {
        IEnumerable<City> GetAll();
    }
}
