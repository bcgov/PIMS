using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// NotificationQueueFilter class, provides a model for filtering notification queue queries.
    /// </summary>
    public class NotificationQueueFilter : PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - Search for notifications with this key.
        /// </summary>
        public Guid? Key { get; set; }

        /// <summary>
        /// get/set - Search for notifications with this status.
        /// </summary>
        public NotificationStatus? Status { get; set; }

        /// <summary>
        /// get/set - Search for notifications sent on or after.
        /// </summary>
        /// <value></value>
        public DateTime? MinSendOn { get; set; }

        /// <summary>
        /// get/set - Search for notifications sent on or before.
        /// </summary>
        /// <value></value>
        public DateTime? MaxSendOn { get; set; }

        /// <summary>
        /// get/set - Search for notifications sent to.
        /// </summary>
        /// <value></value>
        public string To { get; set; }

        /// <summary>
        /// get/set - Search the tags.
        /// </summary>
        /// <value></value>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - Search the subject line.
        /// </summary>
        /// <value></value>
        public string Subject { get; set; }

        /// <summary>
        /// get/set - Search the body.
        /// </summary>
        /// <value></value>
        public string Body { get; set; }

        /// <summary>
        /// get/set - The project associated with the notification.
        /// </summary>
        /// <value></value>
        public int? ProjectId { get; set; }

        /// <summary>
        /// get/set - The project number associated with the notification.
        /// </summary>
        /// <value></value>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The agency the notification was sent to.
        /// </summary>
        /// <value></value>
        public int? AgencyId { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a NotificationQueueFilter class.
        /// </summary>
        public NotificationQueueFilter() { }

        /// <summary>
        /// Creates a new instance of a NotificationQueueFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public NotificationQueueFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.To = filter.GetStringValue(nameof(this.To));
            this.Tag = filter.GetStringValue(nameof(this.Tag));
            this.Subject = filter.GetStringValue(nameof(this.Subject));
            this.Body = filter.GetStringValue(nameof(this.Body));
            this.ProjectId = filter.GetIntNullValue(nameof(this.ProjectId));
            this.AgencyId = filter.GetIntNullValue(nameof(this.AgencyId));
            this.Key = filter.GetGuidNullValue(nameof(this.Key));
            this.MinSendOn = filter.GetDateTimeNullValue(nameof(this.MinSendOn));
            this.MaxSendOn = filter.GetDateTimeNullValue(nameof(this.MaxSendOn));
            this.Status = filter.GetEnumNullValue<NotificationStatus>(nameof(this.Status));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Determine if a valid filter was provided.
        /// </summary>
        /// <returns></returns>
        public override bool IsValid()
        {
            return base.IsValid()
                || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                || !String.IsNullOrWhiteSpace(this.To)
                || !String.IsNullOrWhiteSpace(this.Tag)
                || !String.IsNullOrWhiteSpace(this.Subject)
                || !String.IsNullOrWhiteSpace(this.Body)
                || this.ProjectId.HasValue
                || this.AgencyId.HasValue
                || this.Key.HasValue
                || this.MinSendOn.HasValue
                || this.MaxSendOn.HasValue
                || this.Status.HasValue;
        }
        #endregion
    }
}
