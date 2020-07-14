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
        /// get/set - amount offered by an agency for the project.
        /// </summary>
        public decimal OfferAmount { get; set; }

        /// <summary>
        /// get/set - Foreign key to the notification queue.
        /// </summary>
        public int? NotificationId { get; set; }

        /// <summary>
        /// get/set - The notification queue.
        /// </summary>
        public NotificationQueue Notification { get; set; }

        /// <summary>
        /// get/set - The agencies response to the project [ignore, watch].
        /// </summary>
        public NotificationResponses Response { get; set; }

        /// <summary>
        /// get/set - The date SRES received a business case from this agency.
        /// </summary>
        public DateTime? ReceivedOn { get; set; }

        /// <summary>
        /// get/set - An agency specific note viewable/editable by SRES only.
        /// </summary>
        public string Note { get; set; }
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
        /// <param name="receivedOn"></param>
        public ProjectAgencyResponse(Project project, Agency agency, NotificationQueue notification, NotificationResponses response, DateTime? receivedOn = null)
            : this(project, agency, response, receivedOn)
        {
            this.NotificationId = notification?.Id ?? throw new ArgumentNullException(nameof(notification));
            this.Notification = notification;
        }

        /// <summary>
        /// Create a new instance of a ProjectAgencyResponse class, initializes with specified arguments.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="agency"></param>
        /// <param name="response"></param>
        /// <param name="receivedOn"></param>
        public ProjectAgencyResponse(Project project, Agency agency, NotificationResponses response, DateTime? receivedOn = null)
        {
            this.ProjectId = project?.Id ?? throw new ArgumentNullException(nameof(project));
            this.Project = project;
            this.AgencyId = agency?.Id ?? throw new ArgumentNullException(nameof(agency));
            this.Agency = agency;
            this.Response = response;
            this.ReceivedOn = receivedOn ?? DateTime.UtcNow;
        }
        #endregion
    }
}
