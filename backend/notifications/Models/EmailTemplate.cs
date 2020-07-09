namespace Pims.Notifications.Models
{
    /// <summary>
    /// EmailTemplate class, provides a model for email templates.
    /// </summary>
    public class EmailTemplate : IEmailTemplate
    {
        #region Properties
        /// <summary>
        /// get/set - The subject template.
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - The body type [html, text].
        /// </summary>
        public EmailBodyTypes BodyType { get; set; } = EmailBodyTypes.Html;

        /// <summary>
        /// get/set - The body template.
        /// </summary>
        public string Body { get; set; }
        #endregion
    }
}
