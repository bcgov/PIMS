using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ProjectNotificationService class, provides a service layer to interact with notification templates within the datasource.
    /// </summary>
    public class ProjectNotificationService : BaseService<ProjectStatusNotification>, IProjectNotificationService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectNotificationService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectNotificationService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<TaskService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get the project status notification for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">The project status notification does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        public ProjectStatusNotification Get(int id)
        {
            return this.Context.ProjectStatusNotifications
                .Include(t => t.Template)
                .FirstOrDefault(t => t.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get all the project status notifications for the specified 'fromStatusId' and 'toStatusId'.
        /// </summary>
        /// <param name="fromStatusId"></param>
        /// <param name="toStatusId"></param>
        /// <returns></returns>
        public IEnumerable<ProjectStatusNotification> GetFor(int? fromStatusId, int? toStatusId)
        {
            return this.Context.ProjectStatusNotifications
                .AsNoTracking()
                .Include(t => t.Template)
                .Where(t => (t.FromStatusId == fromStatusId && t.ToStatusId == toStatusId))
                .ToArray();
        }
        #endregion
    }
}
