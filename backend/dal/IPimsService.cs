using System.Security.Claims;
using Pims.Dal.Services;

namespace Pims.Dal
{
    /// <summary>
    /// IPimsService interface, provides a way to interface with the backend datasource.
    /// </summary>
    public interface IPimsService : IService
    {
        #region Properties
        IPropertyService Property { get; }
        IBuildingService Building { get; }
        IProjectService Project { get; }
        ClaimsPrincipal Principal { get; }
        ILookupService Lookup { get; }
        IParcelService Parcel { get; }
        IUserService User { get; }
        ITaskService Task { get; }
        IWorkflowService Workflow { get; }
        INotificationTemplateService NotificationTemplate { get; }
        IProjectNotificationService ProjectNotification { get; }
        INotificationQueueService NotificationQueue { get; }
        #endregion

        #region Methods
        #endregion
    }
}
