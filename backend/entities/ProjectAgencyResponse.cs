using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectAgencyResponse class, provides an entity for the datamodel to manage a responses from agencies on specific projects.
    /// </summary>
    public class ProjectAgencyResponse : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key and foreign key to the project.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The project this response is for.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - Primary key and foreign key to the agency responding..
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency who responded.
        /// </summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - Foreign key to the notification queue.
        /// </summary>
        public int NotificationId { get; set; }

        /// <summary>
        /// get/set - The notification queue.
        /// </summary>
        public NotificationQueue Notification { get; set; }

        /// <summary>
        /// get/set - The agencies response to the project [ignore, watch].
        /// </summary>
        public NotificationResponses Response { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectAgencyResponse class.
        /// </summary>
        public ProjectAgencyResponse() { }

        /// <summary>
        /// Create a new instance of a ProjectAgencyResponse class, initializes with specified arguments.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="agency"></param>
        /// <param name="notification"></param>
        /// <param name="response"></param>
        public ProjectAgencyResponse(Project project, Agency agency, NotificationQueue notification, NotificationResponses response)
        {
            this.ProjectId = project?.Id ?? throw new ArgumentNullException(nameof(project));
            this.Project = project;
            this.AgencyId = agency?.Id ?? throw new ArgumentNullException(nameof(agency));
            this.Agency = agency;
            this.NotificationId = notification?.Id ?? throw new ArgumentNullException(nameof(notification));
            this.Notification = notification;
            this.Response = response;
        }
        #endregion
    }
}
