using System;

namespace Pims.Api.Areas.Reports.Models.Project
{
    /// <summary>
    /// ProjectModel class, provides a model to represent the project.
    /// </summary>
    public class ProjectModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique project number to identify the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The name to identify the project.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The project description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The reported fiscal year this project.
        /// </summary>
        public int ReportedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The actual or forecasted fiscal year.
        /// </summary>
        public int ActualFiscalYear { get; set; }

        /// <summary>
        /// get/set - The current workflow code.
        /// </summary>
        public string WorkflowCode { get; set; }

        /// <summary>
        /// get/set - The current status code.
        /// </summary>
        public string StatusCode { get; set; }

        /// <summary>
        /// get/set - The status label.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The tier level of the project.
        /// </summary>
        public string TierLevel { get; set; }

        /// <summary>
        /// get/set - The project risk.
        /// </summary>
        public string Risk { get; set; }

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
        /// get/set - User name
        /// </summary>
        public string UpdatedBy { get; set; }

        /// <summary>
        /// get/set - When the project was last updated.
        /// </summary>
        public DateTime? UpdatedOn { get; set; }

        /// <summary>
        /// get/set - User name
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// get/set - when the project was created.
        /// </summary>
        public DateTime CreatedOn { get; set; }

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

        #region Financial
        /// <summary>
        /// get/set - The netbook value.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The estimated value.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal Appraised { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        public decimal SalesCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal NetProceeds { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        public decimal ProgramCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal GainLoss { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        public decimal? OcgFinancialStatement { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        public decimal InterestComponent { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Amount offered during SPL
        /// </summary>
        public decimal OfferAmount { get; set; }

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        public bool SaleWithLeaseInPlace { get; set; } // TODO: Move to metadata property.
        #endregion

        #region Notes
        /// <summary>
        /// get/set - The project note.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The project note.
        /// </summary>
        public string PublicNote { get; set; }

        /// <summary>
        /// get/set - The project note.
        /// </summary>
        public string PrivateNote { get; set; }

        /// <summary>
        /// get/set - The appraised note
        /// </summary>
        public string AppraisedNote { get; set; }

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
        /// get/set - When the project was disposed.
        /// </summary>
        public DateTime? DisposedOn { get; set; }

        /// <summary>
        /// get/set - When the project was completed.
        /// </summary>
        public DateTime? CompletedOn { get; set; }
        #endregion

        #region SPL
        /// <summary>
        /// get/set - When the project was externally marketed.
        /// </summary>
        public DateTime? MarketedOn { get; set; } // TODO: Move to metadata property.


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
        #endregion
        #endregion
    }
}
