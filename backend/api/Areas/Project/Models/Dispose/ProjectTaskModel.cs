using System;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectTaskModel class, provides a model to represent a project task.
    /// </summary>
    public class ProjectTaskModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the project.
        /// </summary>
        public string ProjectId { get; set; }

        /// <summary>
        /// get/set - The foreign key to the task.
        /// </summary>
        public int TaskId { get; set; }

        /// <summary>
        /// get/set - Whether the task is complete.
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// get/set - When the task was completed.
        /// </summary>
        public DateTime? CompletedOn { get; set; }

        /// <summary>
        /// get/set - The name of the task.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the task is optional.
        /// </summary>
        public bool IsOptional { get; set; }

        /// <summary>
        /// get/set - Whether the task is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - The sort order
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// get/set - The task status Id.
        /// </summary>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The task status code.
        /// </summary>
        public string StatusCode { get; set; }
        #endregion
    }
}
