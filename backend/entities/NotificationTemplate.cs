using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// NotificationTemplate class, provides an entity for the datamodel to manage a notification templates.
    /// </summary>
    public class NotificationTemplate : BaseEntity
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
        public NotificationAudiences Audience { get; set; } = NotificationAudiences.Default;

        /// <summary>
        /// get/set - The notification encoding [base64, binary, hex, utf-8].
        /// </summary>
        public NotificationEncodings Encoding { get; set; } = NotificationEncodings.Utf8;

        /// <summary>
        /// get/set - The notification body type [html, text].
        /// </summary>
        public NotificationBodyTypes BodyType { get; set; } = NotificationBodyTypes.Html;

        /// <summary>
        /// get/set - The notification priority [low, normal, high]
        /// </summary>
        public NotificationPriorities Priority { get; set; } = NotificationPriorities.Normal;

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
        public ICollection<ProjectStatusNotification> Status { get; } = new List<ProjectStatusNotification>();

        /// <summary>
        /// get - A collection of notifications in the queue that used this template.
        /// </summary>
        public ICollection<NotificationQueue> Notifications { get; } = new List<NotificationQueue>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a NotificationTemplate class.
        /// </summary>
        public NotificationTemplate() { }

        /// <summary>
        /// Create a new instance of a NotificationTemplate class.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationTemplate(string name, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(name));

            this.Name = name;
            this.Subject = subject;
            this.Body = body;
        }

        /// <summary>
        /// Create a new instance of a NotificationTemplate class.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="encoding"></param>
        /// <param name="bodyType"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationTemplate(string name, NotificationEncodings encoding, NotificationBodyTypes bodyType, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(name));

            this.Name = name;
            this.Encoding = encoding;
            this.BodyType = bodyType;
            this.Subject = subject;
            this.Body = body;
        }
        #endregion
    }
}
