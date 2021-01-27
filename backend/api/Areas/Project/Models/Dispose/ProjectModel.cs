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
        /// get/set - The project manager name(s).
        /// </summary>
        public string Manager { get; set; }

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
        /// get/set - Notes for appraisal value.
        /// </summary>
        public string AppraisedNote { get; set; }

        /// <summary>
        /// get/set - Note summerizing offers received.
        /// </summary>
        public string OffersNote { get; set; }

        /// <summary>
        /// get/set - Note for reporting.
        /// </summary>
        public string ReportingNote { get; set; }

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
        /// get/set - When interest within ERP was received on.
        /// </summary>
        public DateTime? InterestedReceivedOn { get; set; }

        /// <summary>
        /// get/set - A note to capture interest in the project during ERP.
        /// </summary>
        public string InterestFromEnhancedReferralNote { get; set; }

        /// <summary>
        /// get/set - When a request to be added to SPL was received.
        /// </summary>
        public DateTime? RequestForSplReceivedOn { get; set; }

        /// <summary>
        /// get/set - When the project was approved to be added to SPL.
        /// </summary>
        public DateTime? ApprovedForSplOn { get; set; }

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
        /// get/set - When the project was assessed.
        /// </summary>
        public DateTime? AssessedOn { get; set; }

        /// <summary>
        /// get/set - When the project had its sale adjusted.
        /// </summary>
        public DateTime? AdjustedOn { get; set; }

        /// <summary>
        /// get/set - When the preliminary form was signed on.
        /// </summary>
        public DateTime? PreliminaryFormSignedOn { get; set; }

        /// <summary>
        /// get/set - When the final form was signed on.
        /// </summary>
        public DateTime? FinalFormSignedOn { get; set; }

        /// <summary>
        /// get/set - When the prior year adjustment sale date occurred on.
        /// </summary>
        public DateTime? PriorYearAdjustmentOn { get; set; }

        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        public string ExemptionRationale { get; set; }

        /// <summary>
        /// get/set - The date the ADM approved the exemption.
        /// </summary>
        public DateTime? ExemptionApprovedOn { get; set; }

        /// <summary>
        /// get/set - The netbook value which is the sum of the properties.
        /// </summary>
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The market value.
        /// </summary>
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal? Appraised { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal? Assessed { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        public decimal? SalesCost { get; set; }

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal? NetProceeds { get; set; }

        /// <summary>
        /// get/set - The SPL program cost.
        /// </summary>
        public decimal? ProgramCost { get; set; }

        /// <summary>
        /// get/set - A note about the SPL program cost.
        /// </summary>
        public string ProgramCostNote { get; set; }

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal? GainLoss { get; set; }

        /// <summary>
        /// get/set - A note about the gain or loss from selling the properties.
        /// </summary>
        public string GainNote { get; set; }

        /// <summary>
        /// get/set - The SPP Capitalization value.
        /// </summary>
        public decimal? SppCapitalization { get; set; }

        /// <summary>
        /// get/set - The gain before SPL.
        /// </summary>
        public decimal? GainBeforeSpl { get; set; }

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        public decimal? OcgFinancialStatement { get; set; }

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        public decimal? InterestComponent { get; set; }

        /// <summary>
        /// get/set - A note about the loan terms.
        /// </summary>
        public string LoanTermsNote { get; set; }

        /// <summary>
        /// get/set - Amount offered during SPL
        /// </summary>
        public decimal? OfferAmount { get; set; }

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        public bool SaleWithLeaseInPlace { get; set; }

        /// <summary>
        /// get/set - Whether an adjustment to prior year sale is required.
        /// </summary>
        public bool PriorYearAdjustment { get; set; }

        /// <summary>
        /// get/set - Whether an adjustment to prior year sale is required.
        /// </summary>
        public decimal? PriorYearAdjustmentAmount { get; set; }

        /// <summary>
        /// get/set - A note about the adjustment.
        /// </summary>
        public string AdjustmentNote { get; set; }

        /// <summary>
        /// get/set - A note about remediation.
        /// </summary>
        public string RemediationNote { get; set; }

        /// <summary>
        /// get/set - Note to capture final close out comments.
        /// </summary>
        public string CloseOutNote { get; set; }

        /// <summary>
        /// get/set - Panned future user description.
        /// </summary>
        public string PlannedFutureUse { get; set; }

        /// <summary>
        /// get/set - the real estate agent
        /// </summary>
        public string Realtor { get; set; }

        /// <summary>
        /// get/set - the real estate agent's rate for this project
        /// </summary>
        public string RealtorRate { get; set; }

        /// <summary>
        /// get/set - the real estate agent's commission for this project
        /// </summary>
        public decimal? RealtorCommission { get; set; }

        /// <summary>
        /// get/set - who signed the preliminary form.
        /// </summary>
        public string PreliminaryFormSignedBy { get; set; }

        /// <summary>
        /// get/set - who signed the final form.
        /// </summary>
        public string FinalFormSignedBy { get; set; }

        /// <summary>
        /// get/set - When the request to be removed from SPL was.
        /// </summary>
        public DateTime? RemovalFromSplRequestOn { get; set; }

        /// <summary>
        /// get/set - When the request to be removed from SPL was approved on.
        /// </summary>
        public DateTime? RemovalFromSplApprovedOn { get; set; }

        /// <summary>
        /// get/set - A note with the reason to remove the project from SPL.
        /// </summary>
        public string RemovalFromSplRationale { get; set; }

        /// <summary>
        /// get/set - A note related to the received documentation.
        /// </summary>
        public string DocumentationNote { get; set; }

        /// <summary>
        /// get/set - Sales history of the properties.
        /// </summary>
        public string SalesHistoryNote { get; set; }

        /// <summary>
        /// get/set - Project general comments.
        /// </summary>
        public string Comments { get; set; }

        /// <summary>
        /// get/set - An array of project notes.
        /// </summary>
        public IEnumerable<ProjectNoteModel> Notes { get; set; } = new List<ProjectNoteModel>();

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
