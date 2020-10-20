using Pims.Dal.Services;
using System.Security.Claims;

namespace Pims.Dal
{
    /// <summary>
    /// IPimsService interface, provides a way to interface with the backend datasource.
    /// </summary>
    public interface IPimsService : IService
    {
        #region Properties
        ClaimsPrincipal Principal { get; }
        ILookupService Lookup { get; }

        IUserService User { get; }

        #region Properties
        IPropertyService Property { get; }
        IBuildingService Building { get; }
        IParcelService Parcel { get; }
        #endregion

        #region Notifications
        INotificationTemplateService NotificationTemplate { get; }
        INotificationQueueService NotificationQueue { get; }
        #endregion

        #region Projects
        IProjectService Project { get; }
        IProjectReportService ProjectReport { get; }
        IProjectNotificationService ProjectNotification { get; }
        IProjectStatusService ProjectStatus { get; }
        ITaskService Task { get; }
        IWorkflowService Workflow { get; }
        #endregion
        #endregion

        #region Methods
        #endregion
    }
}
