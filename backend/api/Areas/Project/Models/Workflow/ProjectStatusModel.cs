using System.Collections.Generic;

namespace Pims.Api.Areas.Project.Models.Workflow
{
    /// <summary>
    /// ProjectStatusModel class, provides a model to represent the project status.
    /// </summary>
    public class ProjectStatusModel : Api.Models.CodeModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A name to describe related status.
        /// </summary>
        public string GroupName { get; set; }

        /// <summary>
        /// get/set - A description of the status.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The route to go to for this status.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        /// get/set - whether or not this status is a milestone, requiring special transition logic.
        /// </summary>
        public bool IsMilestone { get; set; }

        /// <summary>
        /// get/set - Whether this status is optional for the specified workflow.
        /// </summary>
        public bool? IsOptional { get; set; }

        /// <summary>
        /// get/set - The workflow this status belongs to.
        /// </summary>
        public string WorkflowCode { get; set; }

        /// <summary>
        /// get/set - An array of status this status can transition to.
        /// </summary>
        public IEnumerable<ProjectStatusModel> ToStatus { get; set; }
        #endregion
    }
}
