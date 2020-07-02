using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ProjectStatusService class, provides a service layer to interact with project status within the datasource.
    /// </summary>
    public class ProjectStatusService : BaseService<ProjectStatus>, IProjectStatusService
    {
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
        /// Get an array of all project status.
        /// </summary>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public IEnumerable<ProjectStatus> Get()
        {
            var status = this.Context.ProjectStatus
                .AsNoTracking()
                .Include(s => s.Workflows)
                .ThenInclude(w => w.Workflow)
                .OrderBy(s => s.SortOrder);

            return status.ToArray();
        }

        /// <summary>
        /// Get the project status for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">Project status does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        public ProjectStatus Get(int id)
        {
            return this.Context.ProjectStatus
                .Find(id) ?? throw new KeyNotFoundException();
        }
        #endregion
    }
}
