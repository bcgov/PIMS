using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatusTask class, provides an entity for the datamodel to manage a list project statuses.
    /// </summary>
    public class ProjectStatusTask : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key and foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status.
        /// </summary>
        public ProjectStatus Status { get; set; }

        /// <summary>
        /// get/set - The primary key and foreign key tothe task.
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// get/set - The task.
        /// </summary>
        public Task Task { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        public ProjectStatusTask() { }

        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        /// <param name="status"></param>
        /// <param name="task"></param>
        /// <param name="isMilestone"></param>
        public ProjectStatusTask(ProjectStatus status, Task task)
        {
            this.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
            this.Status = status;
            this.TaskId = task?.Id ?? throw new ArgumentNullException(nameof(task));
            this.Task = task;
        }
        #endregion
    }
}
