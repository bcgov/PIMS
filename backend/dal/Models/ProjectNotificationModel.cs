using Pims.Dal.Entities;
using System;

namespace Pims.Dal.Models
{
    public class ProjectNotificationModel
    {
        #region Properties
        public Project Project { get; set; }
        public Guid NotificationKey { get; set; }
        public Agency ToAgency { get; set; }
        #endregion

        #region Constructors
        public ProjectNotificationModel() { }

        public ProjectNotificationModel(Guid notificationKey, Project project, Agency toAgency = null)
        {
            this.NotificationKey = notificationKey;
            this.Project = project;
            this.ToAgency = toAgency;
        }
        #endregion
    }
}
