using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IPropertyStatusService interface, provides a service layer to administer property status within the datasource.
    /// </summary>
    public interface IPropertyStatusService : IBaseService<PropertyStatus>
    {
        IEnumerable<PropertyStatus> GetAll();
    }
}
