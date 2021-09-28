namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectStatusHistoryModel class, provides a model to represent the project status history.
    /// </summary>
    public class ProjectStatusHistoryModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key to identify the project.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project workflow.
        /// </summary>
        public int WorkflowId { get; set; }

        /// <summary>
        /// get/set - The workflow code.
        /// </summary>
        public string Workflow { get; set; }

        /// <summary>
        /// get/set - Foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status code.
        /// </summary>
        public string Status { get; set; }
        #endregion
    }
}
