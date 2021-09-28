using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatusHistory class, provides an entity for the datamodel to manage project status transition history.
    /// </summary>
    public class ProjectStatusHistory : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project history.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The project this history is for.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project workflow.
        /// </summary>
        public int WorkflowId { get; set; }

        /// <summary>
        /// get/set - The project workflow at this point in time.
        /// </summary>
        public Workflow Workflow { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status at this point in time.
        /// </summary>
        public ProjectStatus Status { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatusHistory class.
        /// </summary>
        public ProjectStatusHistory() { }

        /// <summary>
        /// Create a new instance of a ProjectStatusHistory class, initializes with specified arguments
        /// </summary>
        /// <param name="project"></param>
        public ProjectStatusHistory(Project project)
        {
            this.ProjectId = project?.Id ?? throw new ArgumentNullException(nameof(project));
            this.Project = project;
            this.WorkflowId = project.WorkflowId ?? throw new ArgumentException($"Parameter 'project.WorkflowId' is required.");
            this.Workflow = project.Workflow;
            this.StatusId = project.StatusId;
            this.Status = project.Status;
        }
        #endregion
    }
}
