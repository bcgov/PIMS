using Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// TaskModel class, provides a model to represent a task.
    /// </summary>
    public class TaskModel : Api.Models.LookupModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the task type.
        /// </summary>
        public TaskTypes TaskType { get; set; }

        /// <summary>
        /// get/set - The task description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the task is optional.
        /// </summary>
        public bool IsOptional { get; set; }
        #endregion
    }
}
