using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ICityService interface, provides a service layer to administer cities within the datasource.
    /// </summary>
    public interface ICityService : IBaseService<City>
    {
        IEnumerable<City> GetNoTracking(string name);
        IEnumerable<City> GetAll();
    }
}
