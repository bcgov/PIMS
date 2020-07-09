using System;
using System.Collections.Generic;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailModel class, provides a model that represents and controls an email that will be sent.
    /// </summary>
    public class EmailModel : IEmail
    {
        #region Properties
        /// <summary>
        /// get/set - The email address that the message will be sent from.
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// get/set - An array of email addresses to send the message to.
        /// </summary>
        public IEnumerable<string> To { get; set; } = new List<string>();

        /// <summary>
        /// get/set - An array of email addresses to send the message to.
        /// </summary>
        public IEnumerable<string> Bcc { get; set; } = new List<string>();

        /// <summary>
        /// get/set - An array of email addresses to send the message to.
        /// </summary>
        public IEnumerable<string> Cc { get; set; } = new List<string>();

        /// <summary>
        /// get/set - The email encoding.
        /// </summary>
        public EmailEncodings Encoding { get; set; } = EmailEncodings.Utf8;

        /// <summary>
        /// get/set - The email priority.
        /// </summary>
        public EmailPriorities Priority { get; set; } = EmailPriorities.Normal;

        /// <summary>
        /// get/set - The email subject.
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

        /// <summary>
        /// get/set - A tag to identify related messages.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - When the message will be sent.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - An array of attachments.
        /// </summary>
        public IEnumerable<IAttachment> Attachments { get; set; } = new List<AttachmentModel>();
        #endregion
    }
}
