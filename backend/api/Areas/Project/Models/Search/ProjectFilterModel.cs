using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;
using Pims.Dal.Entities.Models;

namespace Pims.Api.Areas.Project.Models.Search
{
    /// <summary>
    /// ProjectFilterModel class, provides a model to contain a project filters.
    /// </summary>
    public class ProjectFilterModel : PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - A project number.
        /// </summary>
        /// <value></value>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - A project name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A status.
        /// </summary>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - A tier level.
        /// </summary>
        public int? TierLevelId { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        public int[] Agencies { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectFilterModel class.
        /// </summary>
        public ProjectFilterModel() { }

        /// <summary>
        /// Creates a new instance of a ProjectFilterModel class, initializes with the specified arguments.
        /// </summary>
        /// <param name="query"></param>
        public ProjectFilterModel(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);

            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.Name = filter.GetStringValue(nameof(this.Name));
            this.StatusId = filter.GetIntNullValue(nameof(this.StatusId));
            this.TierLevelId = filter.GetIntNullValue(nameof(this.TierLevelId));

            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Convert to a ProjectFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator ProjectFilter(ProjectFilterModel model)
        {
            var filter = new ProjectFilter
            {
                Page = model.Page,
                Quantity = model.Quantity,

                ProjectNumber = model.ProjectNumber,
                Name = model.Name,
                StatusId = model.StatusId,
                TierLevelId = model.TierLevelId,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return filter;
        }

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
