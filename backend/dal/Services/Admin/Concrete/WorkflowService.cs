using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// WorkflowService class, provides a service layer to administrate workflows within the datasource.
    /// </summary>
    public class WorkflowService : BaseService<Workflow>, IWorkflowService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a WorkflowService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public WorkflowService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<WorkflowService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of workflows from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<Workflow> GetAll()
        {
            return this.Context.Workflows.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get the workflow for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">Workflow does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public Workflow Get(int id)
        {
            return this.Context.Workflows.Find(id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get an array of workflows that are associated with the specified project 'code'.
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public IEnumerable<Workflow> GetForStatus(string code)
        {
            return (
                from s in this.Context.ProjectStatus
                join ws in this.Context.WorkflowProjectStatus on s.Id equals ws.StatusId
                join w in this.Context.Workflows.Include(w => w.Status).ThenInclude(s => s.Status) on ws.WorkflowId equals w.Id
                where s.Code == code
                select w
                )
                .ToArray();
        }

        /// <summary>
        /// Updates the specified workflow in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Workflow entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var workflow = this.Context.Workflows.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(workflow).CurrentValues.SetValues(entity);
            base.Update(workflow);
        }

        /// <summary>
        /// Remove the specified workflow from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(Workflow entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var workflow = this.Context.Workflows.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(workflow).CurrentValues.SetValues(entity);
            base.Remove(workflow);
        }
        #endregion
    }
}
