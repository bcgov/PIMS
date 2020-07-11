using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IWorkflowService interface, provides a service layer to administer workflows within the datasource.
    /// </summary>
    public interface IWorkflowService : IBaseService<Workflow>
    {
        IEnumerable<Workflow> GetAll();
        Workflow Get(int id);
    }
}
