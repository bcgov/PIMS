using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

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
        /// get/set - The workflow Id.
        /// </summary>
        public int? WorkflowId { get; set; }

        /// <summary>
        /// get/set - An array of status Id.
        /// </summary>
        public int[] StatusId { get; set; }

        /// <summary>
        /// get/set - An array of status Id.
        /// </summary>
        public int[] NotStatusId { get; set; }

        /// <summary>
        /// get/set - The project tier level.
        /// </summary>
        /// <value></value>
        public int? TierLevelId { get; set; }

        /// <summary>
        /// get/set - The actual or forecasted fiscal year of the project.
        /// </summary>
        public int? FiscalYear { get; set; }

        /// <summary>
        /// get/set - Only limit to projects created by current user.
        /// </summary>
        /// <value></value>
        public bool? CreatedByMe { get; set; }

        /// <summary>
        /// get/set - Filter by workflow - SPL
        /// </summary>
        /// <value></value>
        public bool? SPLWorkflow { get; set; }

        /// <summary>
        /// get/set - Only return active projects.
        /// </summary>
        /// <value></value>
        public bool? Active { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }

        /// <summary>
        /// get/set - An array of workflow [SUBMIT-DISPOSAL, ASSESS-DISPOSAL, ASSESS-EXEMPTION, ERP, SPL].
        /// </summary>
        public string[] Workflows { get; set; }

        /// <summary>
        /// get/set - The spl project report that should be used to populate report data.
        /// </summary>
        public int? ReportId { get; set; }
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
            this.WorkflowId = filter.GetIntNullValue(nameof(this.WorkflowId));
            this.StatusId = filter.GetIntArrayValue("status");
            this.StatusId = filter.GetIntArrayValue(nameof(this.StatusId));
            this.NotStatusId = filter.GetIntArrayValue(nameof(this.NotStatusId));
            this.TierLevelId = filter.GetIntNullValue(nameof(this.TierLevelId));
            this.CreatedByMe = filter.GetBoolNullValue(nameof(this.CreatedByMe));
            this.SPLWorkflow = filter.GetBoolNullValue(nameof(this.SPLWorkflow));
            this.Active = filter.GetBoolNullValue(nameof(this.Active));
            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies));
            this.Workflows = filter.GetStringArrayValue(nameof(this.Workflows));
            this.ReportId = filter.GetIntNullValue(nameof(this.ReportId));
            this.FiscalYear = filter.GetIntNullValue(nameof(this.FiscalYear));
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
                || this.TierLevelId.HasValue
                || this.Active.HasValue
                || this.SPLWorkflow.HasValue
                || this.CreatedByMe.HasValue
                || this.FiscalYear.HasValue
                || this.WorkflowId.HasValue
                || (this.StatusId?.Any() ?? false)
                || (this.NotStatusId?.Any() ?? false)
                || (this.Agencies?.Any() ?? false)
                || (this.Workflows?.Any() ?? false);
        }
        #endregion
    }
}
