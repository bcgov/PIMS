using System.Collections.Generic;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailMergeModel class, provides a way to generate multiple emails with a single template.
    /// </summary>
    public class EmailMergeModel : IEmailMerge
    {
        #region Properties
        /// <summary>
        /// get/set - Who the emails will be from (i.e. First Last <first.last@email.com>).
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// get/set - The email encoding.
        /// </summary>
        public EmailEncodings Encoding { get; set; } = EmailEncodings.Utf8;

        /// <summary>
        /// get/set - The email priority.
        /// </summary>
        public EmailPriorities Priority { get; set; } = EmailPriorities.Normal;

        /// <summary>
        /// get/set - The email body type.
        /// </summary>
        public EmailBodyTypes BodyType { get; set; } = EmailBodyTypes.Html;

        /// <summary>
        /// get/set - The email subject (template).
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The email body (template).
        /// </summary>
        public string Body { get; set; }

        /// <summary>
        /// get/set - A way to identify related emails.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - The context provides the template variables for each individual email.
        /// </summary>
        public IEnumerable<IEmailContext> Contexts { get; set; } = new List<EmailContextModel>();

        /// <summary>
        /// get/set - Attachments to include with the email.
        /// </summary>
        public IEnumerable<IAttachment> Attachments { get; set; } = new List<AttachmentModel>();
        #endregion
    }
}
