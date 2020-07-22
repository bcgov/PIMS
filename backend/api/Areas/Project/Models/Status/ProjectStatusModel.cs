namespace Pims.Api.Areas.Project.Models.Status
{
    /// <summary>
    /// ProjectStatusModel class, provides a model to represent the project status.
    /// </summary>
    public class ProjectStatusModel : Api.Models.CodeModel<int>
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
        /// get/set - whether or not this status is a milestone, requiring special transition logic.
        /// </summary>
        public bool IsMilestone { get; set; }

        /// <summary>
        /// get/set - Whether this status is terminal state.
        /// </summary>
        public bool IsTerminal { get; set; }

        /// <summary>
        /// get/set - Whether this status is optional.
        /// </summary>
        public bool? IsOptional { get; set; }
        #endregion
    }
}
