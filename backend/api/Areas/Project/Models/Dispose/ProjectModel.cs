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
        /// get/set - The reported fiscal year this project.
        /// </summary>
        public int ReportedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The actual or forecasted fiscal year.
        /// </summary>
        public int ActualFiscalYear { get; set; }

        /// <summary>
        /// get/set - The foreign key to the workflow.
        /// </summary>
        public int WorkflowId { get; set; }

        /// <summary>
        /// get/set - The code of the workflow.
        /// </summary>
        public string WorkflowCode { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The code of the project status.
        /// </summary>
        public string StatusCode { get; set; }

        /// <summary>
        /// get/set - The status of the project.
        /// </summary>
        public ProjectStatusModel Status { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project risk.
        /// </summary>
        public int RiskId { get; set; }

        /// <summary>
        /// get/set - The project risk name.
        /// </summary>
        public string Risk { get; set; }

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
        /// get/set - Note summerizing offers received.
        /// </summary>
        public string OffersNote { get; set; }

        /// <summary>
        /// get/set - Text field describing project purchaser.
        /// </summary>
        public string Purchaser { get; set; }

        /// <summary>
        /// get/set - Whether or not the contract for the project is conditional
        /// </summary>
        public bool? IsContractConditional { get; set; }

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
        /// get/set - When the project was cancelled.
        /// </summary>
        public DateTime? CancelledOn { get; set; }

        /// <summary>
        /// get/set - When the initial enhanced referral notification was sent.
        /// </summary>
        public DateTime? InitialNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the 30 day enhanced referral notification was sent.
        /// </summary>
        public DateTime? ThirtyDayNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the 60 day enhanced referral notification was sent.
        /// </summary>
        public DateTime? SixtyDayNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the 90 day enhanced referral notification was sent.
        /// </summary>
        public DateTime? NinetyDayNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the on hold enhanced referral notification was sent.
        /// </summary>
        public DateTime? OnHoldNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the project was transferred within the GRE.
        /// </summary>
        public DateTime? TransferredWithinGreOn { get; set; }

        /// <summary>
        /// get/set - When the clearance enhanced referral notification was sent.
        /// </summary>
        public DateTime? ClearanceNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When the project was externally marketed.
        /// </summary>
        public DateTime? MarketedOn { get; set; }

        /// <summary>
        /// get/set - When the project was disposed.
        /// </summary>
        public DateTime? DisposedOn { get; set; }

        /// <summary>
        /// get/set - When the project was disposed.
        /// </summary>
        public DateTime? OfferAcceptedOn { get; set; }

        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        public string ExemptionRationale { get; set; }

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
        /// get/set - Amount offered during SPL
        /// </summary>
        public decimal OfferAmount { get; set; }

        /// <summary>
        /// get/set - An array of properties associated with this project.
        /// </summary>
        public IEnumerable<ProjectPropertyModel> Properties { get; set; } = new List<ProjectPropertyModel>();

        /// <summary>
        /// get/set - An array of tasks associated with this project.
        /// </summary>
        public IEnumerable<ProjectTaskModel> Tasks { get; set; } = new List<ProjectTaskModel>();

        /// <summary>
        /// get/set - An array of agency responses associated with this project.
        /// </summary>
        public IEnumerable<ProjectAgencyResponse> ProjectAgencyResponses { get; set; } = new List<ProjectAgencyResponse>();
        #endregion
    }
}
