using System;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// DisposalProjectMetadata class, provides a model to capture disposal project metadata.
    /// </summary>
    public class DisposalProjectMetadata
    {
        #region Properties
        #region Exemption
        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - The date when the ADM approved the exemption on.
        /// </summary>
        public DateTime? ExemptionApprovedOn { get; set; }
        #endregion

        #region ERP
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
        /// get/set - When interest was received on.
        /// </summary>
        public DateTime? InterestedReceivedOn { get; set; }

        /// <summary>
        /// get/set - When the project was transferred within the GRE.
        /// </summary>
        public DateTime? TransferredWithinGreOn { get; set; }

        /// <summary>
        /// get/set - When the clearance enhanced referral notification was sent.
        /// </summary>
        public DateTime? ClearanceNotificationSentOn { get; set; }
        #endregion

        #region SPL
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
        /// get/set - Text field describing project purchaser.
        /// </summary>
        public string Purchaser { get; set; }

        /// <summary>
        /// get/set - When the offer was accepted on.
        /// </summary>
        public DateTime? OfferAcceptedOn { get; set; }

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
        /// get/set - When the project was disposed.
        /// </summary>
        public DateTime? DisposedOn { get; set; }
        #endregion

        #region Remove from SPL
        /// <summary>
        /// get/set - When the request to be removed from SPL was.
        /// </summary>
        public DateTime? RemovalFromSplRequestOn { get; set; }

        /// <summary>
        /// get/set - When the request to be removed from SPL was approved on.
        /// </summary>
        public DateTime? RemovalFromSplApprovedOn { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - When the project received an BC assessment.
        /// </summary>
        public DateTime? AssessedOn { get; set; }

        /// <summary>
        /// get/set - When the appraisal value was made.
        /// </summary>
        public string AppraisedBy { get; set; }

        /// <summary>
        /// get/set - The date the appraisal was provided.
        /// </summary>
        public DateTime? AppraisedOn { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        public decimal? SalesCost { get; set; }

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal? NetProceeds { get; set; }

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        public decimal? ProgramCost { get; set; }

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal? GainLoss { get; set; }

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
        /// get/set - Best information of planned future use.
        /// </summary>
        public string PlannedFutureUse { get; set; }

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
        #endregion
        #endregion
    }
}
