using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IWorkflowService interface, provides a service layer to administer workflows within the datasource.
    /// </summary>
    public interface IWorkflowService : IBaseService<Workflow>
    {
        IEnumerable<Workflow> GetAll();
        Workflow Get(int id);
        IEnumerable<Workflow> GetForStatus(string code);
    }
}
