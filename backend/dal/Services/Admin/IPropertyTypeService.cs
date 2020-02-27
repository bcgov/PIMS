using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IPropertyTypeService interface, provides a service layer to administer property types within the datasource.
    /// </summary>
    public interface IPropertyTypeService : IBaseService<PropertyType>
    {
        IEnumerable<PropertyType> GetAllNoTracking();
        IEnumerable<PropertyType> GetAll();
    }
}
