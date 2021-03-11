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
        public NotificationStatus Status { get; set; } = NotificationStatus.Pending;

        /// <summary>
        /// get/set - The priority of the notification [low, normal, high].
        /// </summary>
        public NotificationPriorities Priority { get; set; } = NotificationPriorities.Normal;

        /// <summary>
        /// get/set - The notification encoding [base64, binary, hex, utf-8].
        /// </summary>
        public NotificationEncodings Encoding { get; set; } = NotificationEncodings.Utf8;

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
        public NotificationBodyTypes BodyType { get; set; } = NotificationBodyTypes.Html;

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
        /// get/set - Foreign key to the template that generated this notification.
        /// </summary>
        public int? TemplateId { get; set; }

        /// <summary>
        /// get/set - The notification template that generated this notification.
        /// </summary>
        public NotificationTemplate Template { get; set; }

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
        /// Create a new instance of a NotificationQueue class, initializes with specified parameters.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationQueue(NotificationTemplate template, Project project, string to, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(to)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(to));
            if (String.IsNullOrWhiteSpace(subject)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(subject));
            if (String.IsNullOrWhiteSpace(body)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(body));

            this.Key = Guid.NewGuid();
            this.TemplateId = template?.Id ?? throw new ArgumentNullException(nameof(template));
            this.Template = template;
            this.Subject = subject;
            this.Body = body;
            this.BodyType = template.BodyType;
            this.Encoding = template.Encoding;
            this.Priority = template.Priority;
            this.ProjectId = project?.Id;
            this.Project = project;
            this.To = to;
            this.SendOn = DateTime.UtcNow;
            this.Tag = template.Tag;
        }

        /// <summary>
        /// Create a new instance of a NotificationQueue class, initializes with specified parameters.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <param name="toAgency"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationQueue(NotificationTemplate template, Project project, Agency toAgency, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(subject)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(subject));
            if (String.IsNullOrWhiteSpace(body)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(body));

            this.Key = Guid.NewGuid();
            this.TemplateId = template?.Id ?? throw new ArgumentNullException(nameof(template));
            this.Template = template;
            this.Subject = subject;
            this.Body = body;
            this.BodyType = template.BodyType;
            this.Encoding = template.Encoding;
            this.Priority = template.Priority;
            this.ProjectId = project?.Id;
            this.Project = project;
            this.ToAgencyId = toAgency?.Id;
            this.ToAgency = toAgency;
            this.To = toAgency?.Email;
            this.SendOn = DateTime.UtcNow;
            this.Tag = template.Tag;
        }

        /// <summary>
        /// Create a new instance of a NotificationQueue class, initializes with specified parameters.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationQueue(NotificationTemplate template, string to, string subject, string body) : this(template, to, null, null, subject, body)
        {
        }

        /// <summary>
        /// Create a new instance of a NotificationQueue class, initializes with specified parameters.
        /// </summary>
        /// <param name="template"></param>
        /// <param name="to"></param>
        /// <param name="cc"></param>
        /// <param name="bcc"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        public NotificationQueue(NotificationTemplate template, string to, string cc, string bcc, string subject, string body)
        {
            if (String.IsNullOrWhiteSpace(to)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(to));
            if (String.IsNullOrWhiteSpace(subject)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(subject));
            if (String.IsNullOrWhiteSpace(body)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(body));

            this.Key = Guid.NewGuid();
            this.TemplateId = template?.Id ?? throw new ArgumentNullException(nameof(template));
            this.Template = template;
            this.To = to;
            this.Cc = cc;
            this.Bcc = bcc;
            this.Subject = subject;
            this.Body = body;
            this.BodyType = template.BodyType;
            this.Encoding = template.Encoding;
            this.Priority = template.Priority;
            this.SendOn = DateTime.UtcNow;
            this.Tag = template.Tag;
        }
        #endregion
    }
}
