using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IProjectRiskService interface, provides a service layer to administer project risks within the datasource.
    /// </summary>
    public interface IProjectRiskService : IBaseService<ProjectRisk>
    {
        IEnumerable<ProjectRisk> GetAll();
        ProjectRisk Get(int id);
    }
}
