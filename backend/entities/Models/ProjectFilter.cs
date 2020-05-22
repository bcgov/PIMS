using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ProjectFilter class, provides a model for filtering project queries.
    /// </summary>
    public class ProjectFilter : PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - The project number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The project name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The project potential zoning.
        /// </summary>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The project tier level.
        /// </summary>
        /// <value></value>
        public int? TierLevelId { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectFilter class.
        /// </summary>
        public ProjectFilter() { }

        /// <summary>
        /// Creates a new instance of a ProjectFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public ProjectFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.Name = filter.GetStringValue(nameof(this.Name));
            this.StatusId = filter.GetIntNullValue(nameof(this.StatusId));
            this.TierLevelId = filter.GetIntNullValue(nameof(this.TierLevelId));
            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies));
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
                || !String.IsNullOrWhiteSpace(this.Name)
                || this.StatusId.HasValue
                || this.TierLevelId.HasValue
                || this.Agencies?.Any() == true;
        }
        #endregion
    }
}
