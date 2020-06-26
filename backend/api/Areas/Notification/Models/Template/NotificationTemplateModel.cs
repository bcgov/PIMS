using Pims.Api.Models;
using Pims.Core.Converters;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Api.Areas.Notification.Models.Template
{
    public class NotificationTemplateModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key unique identity for notification template.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the template.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A description of the template.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - A semi-colon separated list of email addresses this notification will be sent to.
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// get/set - A semi-colon separated list of email addresses this notification will be carbon-copied to.
        /// </summary>
        public string Cc { get; set; }

        /// <summary>
        /// get/set - A semi-colon separated list of email addresses this notification will be blind carbon-copied to.
        /// </summary>
        public string Bcc { get; set; }

        /// <summary>
        /// get/set - The audience for this notification template.
        /// </summary>
        public NotificationAudiences Audience { get; set; }

        /// <summary>
        /// get/set - The notification encoding [base64, binary, hex, utf-8].
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<NotificationEncodings>))]
        public NotificationEncodings Encoding { get; set; }

        /// <summary>
        /// get/set - The notification body type [html, text].
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<NotificationBodyTypes>))]
        public NotificationBodyTypes BodyType { get; set; }

        /// <summary>
        /// get/set - The notification priority [low, normal, high]
        /// </summary>
        [JsonConverter(typeof(EnumValueJsonConverter<NotificationPriorities>))]
        public NotificationPriorities Priority { get; set; }

        /// <summary>
        /// get/set - The subject line of the notification (supports variables).
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The body of the notification (supports variables).
        /// </summary>
        public string Body { get; set; }

        /// <summary>
        /// get/set - Whether this template is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - A way to group notifications within CHES.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get - A collection of project status that reference this template.
        /// </summary>
        public IEnumerable<ProjectStatusNotificationModel> Status { get; set; } = new List<ProjectStatusNotificationModel>();
        #endregion
    }
}
