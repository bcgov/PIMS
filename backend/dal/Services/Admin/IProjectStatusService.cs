using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IProjectStatusService interface, provides a service layer to administer project status within the datasource.
    /// </summary>
    public interface IProjectStatusService : IBaseService<ProjectStatus>
    {
        IEnumerable<ProjectStatus> GetAll();
        ProjectStatus Get(int id);
    }
}
