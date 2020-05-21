using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectService interface, provides functions to interact with projects within the datasource.
    /// </summary>
    public interface IProjectService
    {
        Project Get(string projectNumber);
        Project Add(Project project);
        Project Update(Project project);
        void Remove(Project project);
        IEnumerable<ProjectStatus> GetWorkflow(string workflow);
    }
}
