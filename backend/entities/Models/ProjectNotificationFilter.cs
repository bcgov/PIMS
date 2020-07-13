using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ProjectNotificationFilter class, provides a model for filtering project queries.
    /// </summary>
    public class ProjectNotificationFilter : PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - The project number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The project id.
        /// </summary>
        public int? ProjectId { get; set; }

        /// <summary>
        /// get/set - The agency id.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The tag.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - An array of status Id.
        /// </summary>
        public NotificationStatus[] Status { get; set; }

        /// <summary>
        /// get/set - Who the notification was sent to.
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// get/set - The subject line.
        /// </summary>
        public string Subject { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectNotificationFilter class.
        /// </summary>
        public ProjectNotificationFilter() { }

        /// <summary>
        /// Creates a new instance of a ProjectNotificationFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public ProjectNotificationFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.ProjectId = filter.GetIntNullValue(nameof(this.ProjectId));
            this.AgencyId = filter.GetIntNullValue(nameof(this.AgencyId));
            this.Tag = filter.GetStringValue(nameof(this.Tag));
            this.To = filter.GetStringValue(nameof(this.To));
            this.Subject = filter.GetStringValue(nameof(this.Subject));
            this.Status = filter.GetStringArrayValue(nameof(this.Status)).Select(s => (NotificationStatus)Enum.Parse(typeof(NotificationStatus), s)).ToArray();
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
                || this.ProjectId.HasValue
                || this.AgencyId.HasValue
                || (this.Status?.Any() ?? false);
        }
        #endregion
    }
}
