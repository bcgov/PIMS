using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectTask class, provides an entity for the datamodel to manage what tasks are associated and completed for the project.
    /// </summary>
    public class ProjectTask : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the project - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The project.
        /// </summary>
        /// <value></value>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - The foreign key to the task - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int TaskId { get; set; }

        /// <summary>
        /// get/set - The task.
        /// </summary>
        /// <value></value>
        public Task Task { get; set; }

        /// <summary>
        /// get/set - Whether the task was completed.
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// get/set - The date when the task was completed.
        /// </summary>
        public DateTime? CompletedOn { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectTask class.
        /// </summary>
        public ProjectTask() { }

        /// <summary>
        /// Create a new instance of a ProjectTask class, initialize it with link to specified task.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="task"></param>
        public ProjectTask(Project project, Task task)
        {
            this.ProjectId = project?.Id ??
                throw new ArgumentNullException(nameof(project));
            this.Project = project;

            this.TaskId = task?.Id ??
                throw new ArgumentNullException(nameof(task));
            this.Task = task;
        }
        #endregion
    }
}
