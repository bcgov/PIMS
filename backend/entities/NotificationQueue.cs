using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// NotificationQueue class, provides an entity for the datamodel to manage a notification queue.
    /// </summary>
    public class NotificationQueue : BaseEntity
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
        public string Encoding { get; set; }

        /// <summary>
        /// get/set - The date the notification should be sent on.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be sent to.
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// get/set - The notification subject line.
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The body type of the notification [html, text].
        /// </summary>
        public string BodyType { get; set; }

        /// <summary>
        /// get/set - The notification body message.
        /// </summary>
        public string Body { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be blind-copied to.
        /// </summary>
        public string Bcc { get; set; }

        /// <summary>
        /// get/set - Semi-colon separated list of email addresses that the notification will be carbon-copied to.
        /// </summary>
        public string Cc { get; set; }

        /// <summary>
        /// get/set - A tag to group related notifications.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project this notification is related to.
        /// </summary>
        public int? ProjectId { get; set; }

        /// <summary>
        /// get/set - The project this notification is related to.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - Foreign key to the agency this notification was sent to.
        /// </summary>
        public int? ToAgencyId { get; set; }

        /// <summary>
        /// get/set - The agency this notification was sent to.
        /// </summary>
        public Agency ToAgency { get; set; }

        /// <summary>
        /// get/set - CHES message Id.
        /// </summary>
        public Guid? ChesMessageId { get; set; }

        /// <summary>
        /// get/set - CHES transaction Id.
        /// </summary>
        public Guid? ChesTransactionId { get; set; }

        /// <summary>
        /// get - A collection of responses to this notification.
        /// </summary>
        public ICollection<ProjectAgencyResponse> Responses { get; } = new List<ProjectAgencyResponse>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a NotificationQueue class.
        /// </summary>
        public NotificationQueue() { }

        /// <summary>
        /// Create a new instance of a NotificationQueue class.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <param name="agency"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationQueue(NotificationTemplate template, Project project, Agency agency, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(subject)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(subject));
            if (String.IsNullOrWhiteSpace(body)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(body));

            this.Subject = subject;
            this.Body = body;
            this.BodyType = template?.BodyType ?? throw new ArgumentNullException(nameof(template));
            this.Encoding = template.Encoding;
            this.Priority = template.Priority;
            this.ProjectId = project?.Id;
            this.Project = project;
            this.ToAgencyId = agency?.Id ?? throw new ArgumentNullException(nameof(agency));
            this.ToAgency = agency;
            this.To = agency.Email;
        }
        #endregion
    }
}
