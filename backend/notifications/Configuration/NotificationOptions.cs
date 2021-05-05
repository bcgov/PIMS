namespace Pims.Notifications.Configuration
{
    /// <summary>
    /// NotificationOptions class, provides a way to configure notifications.
    /// </summary>
    public class NotificationOptions
    {
        /// <summary>
        /// get/set - Whether to immediately send all notifications and ignore their configured SendOn delay values.
        /// This option is helpful for testing and debugging.
        /// </summary>
        public bool SendAllNow { get; set; }
    }
}
