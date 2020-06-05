using System.Collections.Generic;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectModel class, provides a model to represent the project.
    /// </summary>
    public class ProjectModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key to identify the project.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique project number to identify the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The name to identify the project.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status of the project.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The foreign key to the tier level.
        /// </summary>
        public int TierLevelId { get; set; }

        /// <summary>
        /// get/set - The tier level of the project.
        /// </summary>
        public string TierLevel { get; set; }

        /// <summary>
        /// get/set - The project description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The project note.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The owning agency name.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The owning agency code.
        /// </summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The owning subagency name.
        /// </summary>
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The owning subagency code.
        /// </summary>
        public string SubAgencyCode { get; set; }

        /// <summary>
        /// get/set - An array of properties associated with this project.
        /// </summary>
        public IEnumerable<ProjectPropertyModel> ProjectProperties { get; set; } = new List<ProjectPropertyModel>();

        /// <summary>
        /// get/set - An array of tasks associated with this project.
        /// </summary>
        public IEnumerable<ProjectTaskModel> Tasks { get; set; } = new List<ProjectTaskModel>();
        #endregion
    }
}
