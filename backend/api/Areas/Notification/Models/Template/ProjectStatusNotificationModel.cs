using Pims.Dal.Entities;

namespace Pims.Api.Areas.Notification.Models.Template
{
    public class ProjectStatusNotificationModel
    {
        #region Properties

        /// <summary>
        /// get/set - Primary key unique identity for project status notification.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Foreign key to the original project status before the status change.
        /// </summary>
        public int? FromStatusId { get; set; }

        /// <summary>
        /// get/set - The from status name.
        /// </summary>
        public string FromStatus { get; set; }

        /// <summary>
        /// get/set - Foreign key to the desired project status after the status change.
        /// </summary>
        public int? ToStatusId { get; set; }

        /// <summary>
        /// get/set - The to status name.
        /// </summary>
        public string ToStatus { get; set; }

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
    }
}
