namespace Pims.Dal
{
    /// <summary>
    /// AccessRequestOptions class, provides a way to configure PIMS environments.
    /// </summary>
    public class AccessRequestOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The notification template name that will be used when sending an email to administrators.
        /// </summary>
        public string NotificationTemplate { get; set; } = "Access Request";

        /// <summary>
        /// get/set - Email address to send access requests to in addition to system and agency administrators.
        /// </summary>
        public string SendTo { get; set; }
        #endregion
    }
}
