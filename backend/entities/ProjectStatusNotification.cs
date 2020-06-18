using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatusNotification class, provides an entity for the datamodel to manage a notifications associated to project status.
    /// </summary>
    public class ProjectStatusNotification : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key unique identity for project status notification.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Foreign key to the notification template.
        /// </summary>
        public int TemplateId { get; set; }

        /// <summary>
        /// get/set - The notification template.
        /// </summary>
        public NotificationTemplate Template { get; set; }

        /// <summary>
        /// get/set - Foreign key to the original project status before the status change.
        /// </summary>
        public int? FromStatusId { get; set; }

        /// <summary>
        /// get/set - The original project status before the status change..
        /// </summary>
        public ProjectStatus FromStatus { get; set; }

        /// <summary>
        /// get/set - Foreign key to the desired project status after the status change.
        /// </summary>
        public int? ToStatusId { get; set; }

        /// <summary>
        /// get/set - The desired project status after the status change.
        /// </summary>
        public ProjectStatus ToStatus { get; set; }

        /// <summary>
        /// get/set - The notification priority [low, normal, high]
        /// </summary>
        public NotificationPriorities Priority { get; set; }

        /// <summary>
        /// get/set - Controls when the notification will be sent.
        /// </summary>
        public NotificationDelays Delay { get; set; }

        /// <summary>
        /// get/set - The number of days to delay the notification.
        /// </summary>
        public int DelayDays { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatusNotification class.
        /// </summary>
        public ProjectStatusNotification() { }

        /// <summary>
        /// Create a new instance of a ProjectStatusNotification class.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="fromStatus"></param>
        /// <param name="toStatus"></param>
        /// <param name="delay"></param>
        /// <param name="delayDays"></param>
        public ProjectStatusNotification(NotificationTemplate template, ProjectStatus fromStatus, ProjectStatus toStatus, NotificationDelays delay, int delayDays = 0)
        {
            this.TemplateId = template?.Id ?? throw new ArgumentNullException(nameof(template));
            this.Template = template;
            this.FromStatusId = fromStatus?.Id;
            this.FromStatus = fromStatus;
            this.ToStatusId = toStatus?.Id;
            this.ToStatus = toStatus;
            this.Priority = template.Priority;
            this.Delay = delay;
            this.DelayDays = delayDays;
        }
        #endregion
    }
}
