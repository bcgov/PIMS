using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IWorkflowService interface, provides functions to interact with workflows within the datasource.
    /// </summary>
    public interface IWorkflowService : IService
    {
        #region Methods
        IEnumerable<Workflow> Get();
        Workflow Get(int id);
        Workflow Get(string code);
        #endregion
    }
}
