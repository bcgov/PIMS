namespace Pims.Dal.Entities
{
    /// <summary>
    /// NotificationResponses enum, provides the notification response options.
    /// </summary>
    public enum NotificationResponses
    {
        /// <summary>
        /// Agency does not want to receive notifications.
        /// </summary>
        Unsubscribe = 0,
        /// <summary>
        /// Agency wants to receive notifications.
        /// </summary>
        Subscribe = 1,
        /// <summary>
        /// Agency does not want to receive notifications, but is interested in watching the project.
        /// </summary>
        Watch = 2
    }
}
