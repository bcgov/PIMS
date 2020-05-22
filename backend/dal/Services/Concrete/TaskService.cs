using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// TaskService class, provides a service layer to interact with projects within the datasource.
    /// </summary>
    public class TaskService : BaseService<Task>, ITaskService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a TaskService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public TaskService(PimsContext dbContext, ClaimsPrincipal user, ILogger<TaskService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of tasks for the specified type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public IEnumerable<Task> Get(TaskTypes type)
        {
            var tasks = this.Context.Tasks
                .AsNoTracking()
                .OrderBy(t => t.SortOrder)
                .ThenBy(t => t.Name)
                .Where(t => t.TaskType == type);

            return tasks.ToArray();
        }
        #endregion
    }
}
