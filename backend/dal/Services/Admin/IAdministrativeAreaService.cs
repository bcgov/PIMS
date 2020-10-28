using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IAdministrativeAreaService interface, provides a service layer to administer administrative areas (city, municipality, district, etc.) within the datasource.
    /// </summary>
    public interface IAdministrativeAreaService : IBaseService<AdministrativeArea>
    {
        AdministrativeArea Get(string name);
        IEnumerable<AdministrativeArea> GetAll();
    }
}
