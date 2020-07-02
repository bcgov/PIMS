using System.Collections.Generic;

namespace Pims.Api.Areas.Project.Models.Dispose
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
        /// get/set - Whether this status corresponds to a terminal project.
        /// </summary>
        public bool IsTerminal { get; set; }

        /// <summary>
        /// get/set - The tasks associated with this status.
        /// </summary>
        public IEnumerable<ProjectTaskModel> Tasks { get; set; }
        #endregion
    }
}
