using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// WorkflowService class, provides a service layer to interact with workflows within the datasource.
    /// </summary>
    public class WorkflowService : BaseService<Task>, IWorkflowService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a WorkflowService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public WorkflowService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<TaskService> logger) : base(dbContext, user, service, logger)
        {
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of workflows for the specified type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public IEnumerable<Workflow> Get()
        {
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);
            var workflows = this.Context.Workflows
                .AsNoTracking()
                .OrderBy(t => t.SortOrder)
                .ThenBy(t => t.Name);

            return workflows.ToArray();
        }

        /// <summary>
        /// Get the workflow for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">The workflow for the specified 'id' does not exist.</exception>
        /// <returns></returns>
        public Workflow Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);
            var workflow = this.Context.Workflows
                .AsNoTracking()
                .Include(w => w.Status)
                .ThenInclude(s => s.Status)
                .FirstOrDefault(w => w.Id == id) ?? throw new KeyNotFoundException();

            return workflow;
        }

        /// <summary>
        /// Get the workflow for the specified 'code'.
        /// </summary>
        /// <param name="code"></param>
        /// <exception cref="KeyNotFoundException">The workflow for the specified 'code' does not exist.</exception>
        /// <returns></returns>
        public Workflow Get(string code)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);
            var workflow = this.Context.Workflows
                .AsNoTracking()
                .Include(w => w.Status)
                .ThenInclude(s => s.Status)
                .Include(w => w.Status)
                .ThenInclude(s => s.ToStatus)
                .ThenInclude(t => t.ToWorkflowStatus)
                .ThenInclude(s => s.Status)
                .Include(w => w.Status)
                .ThenInclude(s => s.ToStatus)
                .ThenInclude(t => t.ToWorkflowStatus)
                .ThenInclude(s => s.Workflow)
                .FirstOrDefault(w => w.Code == code) ?? throw new KeyNotFoundException();

            return workflow;
        }
        #endregion
    }
}
