using System;
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
        /// get/set - The fiscal year this project is relevant to.
        /// </summary>
        public int FiscalYear { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status of the project.
        /// </summary>
        public ProjectStatusModel Status { get; set; }

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
        /// get/set - A shared note between SRES and agency.
        /// </summary>
        public string PublicNote { get; set; }

        /// <summary>
        /// get/set - A private note for SRES only.
        /// </summary>
        public string PrivateNote { get; set; }

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
        /// get/set - When the project was submitted.
        /// </summary>
        public DateTime? SubmittedOn { get; set; }

        /// <summary>
        /// get/set - When the project was approved.
        /// </summary>
        public DateTime? ApprovedOn { get; set; }

        /// <summary>
        /// get/set - When the project was denied.
        /// </summary>
        public DateTime? DeniedOn { get; set; }

        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        public string ExemptionRational { get; set; }

        /// <summary>
        /// get/set - The netbook value which is the sum of the properties.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The estimated value which is the sum of the properties.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The assessed value which is the sum of the properties.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - An array of properties associated with this project.
        /// </summary>
        public IEnumerable<ProjectPropertyModel> Properties { get; set; } = new List<ProjectPropertyModel>();

        /// <summary>
        /// get/set - An array of tasks associated with this project.
        /// </summary>
        public IEnumerable<ProjectTaskModel> Tasks { get; set; } = new List<ProjectTaskModel>();
        #endregion
    }
}
