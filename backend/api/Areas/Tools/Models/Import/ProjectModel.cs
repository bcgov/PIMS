using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Tools.Models.Import
{
    public class ProjectModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique identity for the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - A display name to identify the project.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The current workflow the project is in.
        /// </summary>
        public string WorkflowCode { get; set; }

        /// <summary>
        /// get/set - The project manager name(s).
        /// </summary>
        public string Manager { get; set; }

        /// <summary>
        /// get/set - The reported fiscal year this project.
        /// </summary>
        public int ReportedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The actual or forecasted fiscal year.
        /// </summary>
        public int ActualFiscalYear { get; set; }

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
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The code of the project status.
        /// </summary>
        public string StatusCode { get; set; }

        /// <summary>
        /// get/set - A description of the project.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - A simple way to capture notes for the project.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The foreign key to the tier level.
        /// </summary>
        public int TierLevelId { get; set; }

        /// <summary>
        /// get/set - The tier level.
        /// </summary>
        public string TierLevel { get; set; }

        /// <summary>
        /// get/set - A shared note between SRES and agency.
        /// </summary>
        public string PublicNote { get; set; }

        /// <summary>
        /// get/set - Appraised note
        /// </summary>
        public string AppraisedNote { get; set; }
        
        /// <summary>
        /// get/set - A private note for SRES only.
        /// </summary>
        
        public string PrivateNote { get; set; }

        /// <summary>
        /// get/set - Additional serialized metadata.
        /// </summary>
        public string Metadata { get; set; }

        #region ERP
        /// <summary>
        /// get/set - Note summerizing agency responses to notifications.
        /// </summary>
        public string AgencyResponseNote { get; set; }
        #endregion

        #region Dates
        /// <summary>
        /// get/set - When the project was submitted.
        /// </summary>
        public DateTime? SubmittedOn { get; set; }

        /// <summary>
        /// get/set - When the project was approved.
        /// </summary>
        public DateTime? ApprovedOn { get; set; }

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
        /// get/set - When the project was denied.
        /// </summary>
        public DateTime? DeniedOn { get; set; }

        /// <summary>
        /// get/set - When the project was cancelled.
        /// </summary>
        public DateTime? CancelledOn { get; set; }

        /// <summary>
        /// get/set - When the project was externally marketed.
        /// </summary>
        public DateTime? MarketedOn { get; set; }

        /// <summary>
        /// get/set - When the project was disposed.
        /// </summary>
        public DateTime? CompletedOn { get; set; }
        #endregion

        #region Exemption
        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - The rational for the exemption from ERP.
        /// </summary>
        public string ExemptionRationale { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The netbook value.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The estimated value.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal Appraised { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        public decimal SalesCost { get; set; }

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal NetProceeds { get; set; }

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        public decimal ProgramCost { get; set; }

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal GainLoss { get; set; }

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        public decimal OcgFinancialStatement { get; set; }

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        public decimal InterestComponent { get; set; }
        #endregion

        ///// <summary>
        ///// get - A collection of properties associated to this project.
        ///// </summary>
        //public IEnumerable<ProjectProperty> Properties { get; set; }

        /// <summary>
        /// get - A collection of notes for this project.
        /// </summary>
        public IEnumerable<ProjectNoteModel> Notes { get; set; }

        /// <summary>
        /// get - A collection of responses for this project.
        /// </summary>
        public IEnumerable<ProjectAgencyResponseModel> Responses { get; set; }
        #endregion
    }
}
