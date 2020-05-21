using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ITaskService interface, provides functions to interact with tasks within the datasource.
    /// </summary>
    public interface ITaskService
    {
        IEnumerable<Task> Get(TaskTypes type);
    }
}
