using System;

namespace Pims.Dal.Entities.Models
{
    public class ProjectMetadata
    {
        #region Properties
        public DateTime? InterestedReceivedOn { get; set; }
        public DateTime? InitialNotificationSentOn { get; set; }
        public DateTime? ThirtyDayNotificationSentOn { get; set; }
        public DateTime? SixtyDayNotificationSentOn { get; set; }
        public DateTime? NinetyDayNotificationSentOn { get; set; }
        public DateTime? OnHoldNotificationSentOn { get; set; }
        public DateTime? ClearanceNotificationSentOn { get; set; }
        public DateTime? MarketedOn { get; set; }
        #endregion
    }
}
