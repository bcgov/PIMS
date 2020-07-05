namespace Pims.Dal.Entities
{
    /// <summary>
    /// NotificationAudiences enum, provides notification audience options.
    /// </summary>
    public enum NotificationAudiences
    {
        /// <summary>
        /// Notifications are sent to the `NotificationTemplate.To` addresses.
        /// </summary>
        Default = 0,
        /// <summary>
        /// Notifications are sent to all agencies that have emails enabled and haven't opted out.
        /// </summary>
        Agencies = 1,
        /// <summary>
        /// Notifications are sent to only parent agencies that have emails enabled and havne't opted out.
        /// </summary>
        ParentAgencies = 2,
        /// <summary>
        /// Notifications are sent to the owning agency.
        /// </summary>
        OwningAgency = 3,
        /// <summary>
        /// Agencies that have shown interest in the project.
        /// </summary>
        WatchingAgencies = 4
    }
}
