using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// WorkflowProjectStatus class, provides a way to manage which project status are related to this workflow.
    /// </summary>
    public class WorkflowProjectStatus : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key and foreign key to the owning workflow.
        /// </summary>
        public int WorkflowId { get; set; }

        /// <summary>
        /// get/set - Owning workflow.
        /// </summary>
        public Workflow Workflow { get; set; }

        /// <summary>
        /// get/set - Primary key and foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status.
        /// </summary>
        public ProjectStatus Status { get; set; }

        /// <summary>
        /// get/set - The sort order of the status for this workflow.
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// get/set - Whether this workflow project status is an optional path.
        /// </summary>
        public bool IsOptional { get; set; }

        /// <summary>
        /// get - Collection of status transitions this status can go to.
        /// </summary>
        public ICollection<ProjectStatusTransition> ToStatus { get; } = new List<ProjectStatusTransition>();

        /// <summary>
        /// get - Collection of status transitions this status can come from.
        /// </summary>
        public ICollection<ProjectStatusTransition> FromStatus { get; } = new List<ProjectStatusTransition>();
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a WorkflowProjectStatus object.
        /// </summary>
        public WorkflowProjectStatus() { }

        /// <summary>
        /// Creates a new instance of a WorkflowProjectStatus object, initializes it with specified arguments.
        /// </summary>
        /// <param name="workflow"></param>
        /// <param name="status"></param>
        /// <param name="sortOrder"></param>
        public WorkflowProjectStatus(Workflow workflow, ProjectStatus status, int sortOrder = 0)
        {
            this.Workflow = workflow;
            this.WorkflowId = workflow?.Id ?? throw new ArgumentNullException(nameof(workflow));
            this.Status = status;
            this.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
            this.SortOrder = sortOrder;
        }
        #endregion
    }
}
