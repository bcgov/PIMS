using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectStatusService interface, provides functions to interact with project status within the datasource.
    /// </summary>
    public interface IProjectStatusService : IService
    {
        IEnumerable<ProjectStatus> Get();
        ProjectStatus Get(int id);
    }
}
