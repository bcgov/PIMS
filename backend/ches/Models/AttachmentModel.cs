namespace Pims.Ches.Models
{
    /// <summary>
    /// AttachmentModel class, provides a model that represents an attachment to an email.
    /// </summary>
    public class AttachmentModel : IAttachment
    {
        #region Properties
        /// <summary>
        /// get/set - The content of the attachment.
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// get/set - The content type.
        /// </summary>
        public string ContentType { get; set; }

        /// <summary>
        /// get/set - The encoding of the attachment.
        /// </summary>
        public string Encoding { get; set; }

        /// <summary>
        /// get/set - The file name of the attachment.
        /// </summary>
        public string Filename { get; set; }
        #endregion
    }
}
