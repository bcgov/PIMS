namespace Pims.Api.Areas.Project.Models.Status
{
    /// <summary>
    /// TaskModel class, provides a model to represent a task.
    /// </summary>
    public class TaskModel : Api.Models.LookupModel<int>
    {
        #region Properties
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
