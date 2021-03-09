namespace Pims.Ches.Configuration
{
    /// <summary>
    /// ChesOptions class, provides a way to configure the Ches.
    /// </summary>
    public class ChesOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The authentication URL.
        /// </summary>
        public string AuthUrl { get; set; }

        /// <summary>
        /// get/set - The URI to the Ches API service.
        /// </summary>
        public string HostUri { get; set; }

        /// <summary>
        /// get/set - The email address that all emails will be 'from'.
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// get/set - The API username.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The API user password.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// get/set - Whether to send email to CHES.
        /// </summary>
        public bool EmailEnabled { get; set; }

        /// <summary>
        /// get/set - When not authorized, email will only be sent to the current user.
        /// </summary>
        public bool EmailAuthorized { get; set; }

        /// <summary>
        /// get/set - Send all emails to this email address instead of their original recipients.
        /// </summary>
        public string OverrideTo { get; set; }

        /// <summary>
        /// get/set - Send emails to the currently user as Bcc.
        /// </summary>
        public bool BccUser { get; set; }

        /// <summary>
        /// get/set - Always BCC the specified email address.
        /// </summary>
        public string AlwaysBcc { get; set; }

        /// <summary>
        /// get/set - Number of seconds to delay sending notifications from their configured 'send on' date and time.
        /// </summary>
        /// <value></value>
        public int? AlwaysDelay { get; set; }
        #endregion
    }
}
