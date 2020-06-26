using Pims.Api.Models;
using Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Notification.Models.Queue
{
    public class NotificationQueueModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key unique identity for notification template.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique key to identify this notification when recipients respond.
        /// </summary>
        public Guid Key { get; set; }

        /// <summary>
        /// get/set - The status of the notification [accepted, pending, cancelled, failed, completed].
        /// </summary>
        public NotificationStatus Status { get; set; }

        /// <summary>
        /// get/set - The priority of the notification [low, normal, high].
        /// </summary>
        public NotificationPriorities Priority { get; set; }

        /// <summary>
        /// get/set - The notification encoding [base64, binary, hex, utf-8].
        /// </summary>
        public NotificationEncodings Encoding { get; set; }

        /// <summary>
        /// get/set - The body type of the notification [html, text].
        /// </summary>
        public NotificationBodyTypes BodyType { get; set; }

        /// <summary>
        /// get/set - The date the notification should be sent on.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be sent to.
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be blind-copied to.
        /// </summary>
        public string Bcc { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be carbon-copied to.
        /// </summary>
        public string Cc { get; set; }

        /// <summary>
        /// get/set - The notification subject line.
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The notification body message.
        /// </summary>
        public string Body { get; set; }

        /// <summary>
        /// get/set - A tag to group related notifications.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project this notification is related to.
        /// </summary>
        public int? ProjectId { get; set; }

        /// <summary>
        /// get/set - Foreign key to the agency this notification was sent to.
        /// </summary>
        public int? ToAgencyId { get; set; }

        /// <summary>
        /// get/set - CHES message Id.
        /// </summary>
        public Guid? ChesMessageId { get; set; }

        /// <summary>
        /// get/set - CHES transaction Id.
        /// </summary>
        public Guid? ChesTransactionId { get; set; }
        #endregion
    }
}
