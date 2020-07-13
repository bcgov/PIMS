using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IPropertyTypeService interface, provides a service layer to administer property types within the datasource.
    /// </summary>
    public interface IPropertyTypeService : IBaseService<PropertyType>
    {
        IEnumerable<PropertyType> GetAll();
    }
}
