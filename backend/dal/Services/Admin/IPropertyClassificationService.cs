using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IPropertyClassificationService interface, provides a service layer to administer property classifications within the datasource.
    /// </summary>
    public interface IPropertyClassificationService : IBaseService<PropertyClassification>
    {
        IEnumerable<PropertyClassification> GetAll();
    }
}
