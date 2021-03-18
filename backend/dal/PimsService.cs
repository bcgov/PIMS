using Microsoft.Extensions.DependencyInjection;
using Pims.Dal.Services;
using System;
using System.Security.Claims;

namespace Pims.Dal
{
    /// <summary>
    /// PimsService class, provides a encapsulated way to references all the independent services.
    /// </summary>
    public class PimsService : IPimsService
    {
        #region Variables
        private readonly IServiceProvider _serviceProvider;
        #endregion

        #region Properties
        /// <summary>
        /// get - The user calling the service.
        /// </summary>
        public ClaimsPrincipal Principal { get; }

        /// <summary>
        /// get - The property services.
        /// </summary>
        public IPropertyService Property { get { return _serviceProvider.GetService<IPropertyService>(); } }

        /// <summary>
        /// get - The building services.
        /// </summary>
        public IBuildingService Building { get { return _serviceProvider.GetService<IBuildingService>(); } }

        /// <summary>
        /// get - The project services.
        /// </summary>
        public IProjectService Project { get { return _serviceProvider.GetService<IProjectService>(); } }

        /// <summary>
        /// get - The project report services.
        /// </summary>
        public IProjectReportService ProjectReport { get { return _serviceProvider.GetService<IProjectReportService>(); } }

        /// <summary>
        /// get - The lookup services.
        /// </summary>
        public ILookupService Lookup { get { return _serviceProvider.GetService<ILookupService>(); } }

        /// <summary>
        /// get - The parcel services.
        /// </summary>
        public IParcelService Parcel { get { return _serviceProvider.GetService<IParcelService>(); } }

        /// <summary>
        /// get - The user services.
        /// </summary>
        public IUserService User { get { return _serviceProvider.GetService<IUserService>(); } }

        /// <summary>
        /// get - The task services.
        /// </summary>
        public ITaskService Task { get { return _serviceProvider.GetService<ITaskService>(); } }

        /// <summary>
        /// get - The workflow services.
        /// </summary>
        public IWorkflowService Workflow { get { return _serviceProvider.GetService<IWorkflowService>(); } }

        /// <summary>
        /// get - The notification template services.
        /// </summary>
        public INotificationTemplateService NotificationTemplate { get { return _serviceProvider.GetService<INotificationTemplateService>(); } }

        /// <summary>
        /// get - The project notification services.
        /// </summary>
        public IProjectNotificationService ProjectNotification { get { return _serviceProvider.GetService<IProjectNotificationService>(); } }

        /// <summary>
        /// get - The project status services.
        /// </summary>
        public IProjectStatusService ProjectStatus { get { return _serviceProvider.GetService<IProjectStatusService>(); } }

        /// <summary>
        /// get - The notification queue services.
        /// </summary>
        public INotificationQueueService NotificationQueue { get { return _serviceProvider.GetService<INotificationQueueService>(); } }

        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PimsService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="serviceProvider"></param>
        public PimsService(ClaimsPrincipal user, IServiceProvider serviceProvider)
        {
            this.Principal = user;
            _serviceProvider = serviceProvider;
        }

        /// <summary>
        /// Get the original value of the specified 'entity'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public T OriginalValue<T>(object entity, string propertyName)
        {
            return this.Project.OriginalValue<T>(entity, propertyName);
        }
        #endregion

        #region Methods
        #endregion
    }
}
