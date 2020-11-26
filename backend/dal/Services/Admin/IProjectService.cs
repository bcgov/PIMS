using Pims.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IProjectService interface, provides a service layer to administer projects within the datasource.
    /// </summary>
    public interface IProjectService : IBaseService<Project>
    {
        Project Get(int id);
        Project Get(int id, params Expression<Func<Project, object>>[] includes);
        Project Get(string projectNumber);
        Project Get(string projectNumber, params Expression<Func<Project, object>>[] includes);
        IEnumerable<ProjectSnapshot> GetSnapshots(int projectId);
        void Add(IEnumerable<Project> projects);
        void Update(IEnumerable<Project> projects);
        string GenerateProjectNumber();
        void UpdateProjectNumber(Project project, string projectNumber);
    }
}
