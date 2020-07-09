using System;
using System.Collections.Generic;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// Email class, provides a model that represents an email.
    /// </summary>
    public class Email : IEmail
    {
        /// <summary>
        /// get/set - The email address that identifies who it is from (i.e. First Last <first.last@email.com>).
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to send the email to.
        /// </summary>
        public IEnumerable<string> To { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to carbon-copy.
        /// </summary>
        public IEnumerable<string> Cc { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to blind carbon-copy.
        /// </summary>
        public IEnumerable<string> Bcc { get; set; }

        /// <summary>
        /// get/set - The email encoding.
        /// </summary>
        public EmailEncodings Encoding { get; set; } = EmailEncodings.Utf8;

        /// <summary>
        /// get/set - The email priority.
        /// </summary>
        public EmailPriorities Priority { get; set; } = EmailPriorities.Normal;

        /// <summary>
        /// get/set - A tag to identify related emails.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - When to send the email.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// getset - The email subject.
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The email body type.
        /// </summary>
        public EmailBodyTypes BodyType { get; set; } = EmailBodyTypes.Html;

        /// <summary>
        /// get/set - The email body.
        /// </summary>
        public string Body { get; set; }
    }
}
