using System;

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
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a WorkflowProjectStatus object.
        /// </summary>
        public WorkflowProjectStatus() { }

        /// <summary>
        /// Creates a new instance of a WorkflowProjectStatus object, initializes it with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        public WorkflowProjectStatus(Workflow workflow, ProjectStatus status)
        {
            this.Workflow = workflow;
            this.WorkflowId = workflow?.Id ?? throw new ArgumentNullException(nameof(workflow));
            this.Status = status;
            this.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
        }
        #endregion
    }
}
