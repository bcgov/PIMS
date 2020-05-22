using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectService interface, provides functions to interact with projects within the datasource.
    /// </summary>
    public interface IProjectService
    {
        Paged<Project> GetPage(ProjectFilter filter);
        Project Get(string projectNumber);
        Project Add(Project project);
        Project Update(Project project);
        void Remove(Project project);
        IEnumerable<ProjectStatus> GetWorkflow(string workflow);
    }
}
