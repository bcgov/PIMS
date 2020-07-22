using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatusTransition class, provides a way to manage workflow project status transitions within the solution.
    /// </summary>
    public class ProjectStatusTransition : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Foreign key to the workflow project status this transitions is from.
        /// </summary>
        public int FromWorkflowId { get; set; }

        /// <summary>
        /// get/set - Foreign key to the workflow project status this transition is from.
        /// </summary>
        public int FromStatusId { get; set; }

        /// <summary>
        /// get/set - The workflow project status this transition is from.
        /// </summary>
        public WorkflowProjectStatus FromWorkflowStatus { get; set; }

        /// <summary>
        /// get/set - The action name that describes the transition.
        /// </summary>
        public string Action { get; set; }

        /// <summary>
        /// get/set - Foreign key to the workflow project status this goes to.
        /// </summary>
        public int ToWorkflowId { get; set; }

        /// <summary>
        /// get/set - Foreign key to the workflow project status this goes to.
        /// </summary>
        public int ToStatusId { get; set; }

        /// <summary>
        /// get/set - Whether this status requires validating prior tasks before transitioning.
        /// </summary>
        public bool ValidateTasks { get; set; } = true;

        /// <summary>
        /// get/set - The workflow project status this goes to.
        /// </summary>
        public WorkflowProjectStatus ToWorkflowStatus { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectStatusTransition object.
        /// </summary>
        public ProjectStatusTransition() { }

        /// <summary>
        /// Creates a new instance of a ProjectStatusTransition object, initializes it with specified arguments.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="action"></param>
        /// <param name="to"></param>
        public ProjectStatusTransition(WorkflowProjectStatus from, string action, WorkflowProjectStatus to)
        {
            this.FromWorkflowStatus = from ?? throw new ArgumentNullException(nameof(from));
            this.FromWorkflowId = from.WorkflowId;
            this.FromStatusId = from.StatusId;
            from.ToStatus.Add(this);
            this.Action = action;
            this.ToWorkflowStatus = to ?? throw new ArgumentNullException(nameof(to));
            this.ToWorkflowId = to.WorkflowId;
            this.ToStatusId = to.StatusId;
            to.FromStatus.Add(this);
        }
        #endregion
    }
}
