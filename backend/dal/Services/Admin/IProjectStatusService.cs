using Pims.Dal.Entities;
using System.Collections.Generic;

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
