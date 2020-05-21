namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectStatusModel class, provides a model to represent the project status.
    /// </summary>
    public class ProjectStatusModel : Api.Models.LookupModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the status.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The route to go to for this status.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        /// get/set - The workflow this status belongs to.
        /// </summary>
        public string Workflow { get; set; }
        #endregion
    }
}
