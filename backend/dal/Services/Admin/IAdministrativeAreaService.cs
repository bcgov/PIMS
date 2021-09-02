using Pims.Dal.Entities;
using System.Collections.Generic;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IAdministrativeAreaService interface, provides a service layer to administer administrative areas (city, municipality, district, etc.) within the datasource.
    /// </summary>
    public interface IAdministrativeAreaService : IBaseService<AdministrativeArea>
    {
        AdministrativeArea Get(string name);
        AdministrativeArea Get(int id);
        Paged<AdministrativeArea> Get(AdministrativeAreaFilter filter);
        Paged<AdministrativeArea> Get(int page, int quantity);
        IEnumerable<AdministrativeArea> GetAll();
    }
}
