using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IProvinceService interface, provides a service layer to administer provinces within the datasource.
    /// </summary>
    public interface IProvinceService : IBaseService<Province>
    {
        IEnumerable<Province> GetAll();
    }
}
