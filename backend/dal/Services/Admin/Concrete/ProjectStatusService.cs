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
    /// ProjectStatusService class, provides a service layer to administrate project status within the datasource.
    /// </summary>
    public class ProjectStatusService : BaseService<ProjectStatus>, IProjectStatusService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectStatusService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectStatusService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ProjectStatusService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of project status from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<ProjectStatus> GetAll()
        {
            return this.Context.ProjectStatus.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get the project status for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">ProjectStatus does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public ProjectStatus Get(int id)
        {
            return this.Context.ProjectStatus.Find(id) ?? throw new KeyNotFoundException("Project status does not exist.");
        }

        /// <summary>
        /// Updates the specified project status in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(ProjectStatus entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var project = Get(entity.Id);

            this.Context.Entry(project).CurrentValues.SetValues(entity);
            base.Update(project);
        }

        /// <summary>
        /// Remove the specified project status from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(ProjectStatus entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var project = Get(entity.Id);

            this.Context.Entry(project).CurrentValues.SetValues(entity);
            base.Remove(project);
        }
        #endregion
    }
}
