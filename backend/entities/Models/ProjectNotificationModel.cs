using System;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ProjectNotificationModel class, provides a model that is used to generate notifications.
    /// </summary>
    public class ProjectNotificationModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique key to identify this notification.
        /// </summary>
        public Guid NotificationKey { get; set; }

        /// <summary>
        /// get/set - The project associated with the notification.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - The agency this notification was sent to.
        /// </summary>
        public Agency ToAgency { get; set; }

        /// <summary>
        /// get/set - Environmental variables.
        /// </summary>
        public EnvironmentModel Environment { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectNotificationModel.
        /// </summary>
        public ProjectNotificationModel() { }

        /// <summary>
        /// Creates a new instance of a ProjectNotificationModel, initialize with specified arguments.
        /// </summary>
        /// <param name="notificationKey"></param>
        /// <param name="environment"></param>
        /// <param name="project"></param>
        /// <param name="toAgency"></param>
        public ProjectNotificationModel(Guid notificationKey, EnvironmentModel environment, Project project, Agency toAgency = null)
        {
            this.NotificationKey = notificationKey;
            this.Project = project;
            this.ToAgency = toAgency;
            this.Environment = environment;
        }
        #endregion
    }
}
