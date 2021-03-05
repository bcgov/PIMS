using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Tools.Models.Import
{
    /// <summary>
    /// ImportProjectModel class, provides a way to import projects into PIMS.
    /// </summary>
    public class ImportProjectModel
    {
        #region Properties
        #region Identity
        /// <summary>
        /// get/set - The unique ID for the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The fiscal year the project was reported.
        /// </summary>
        public int ReportedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The forecasted or actual fiscal year the project was disposed.
        /// </summary>
        public int ActualFiscalYear { get; set; }

        /// <summary>
        /// get/set - The major activity the project is currently under.
        /// </summary>
        public string Activity { get; set; }

        /// <summary>
        /// get/set - The workflow the project is in.
        /// If not provided the 'Status' will be used to determine the workflow.
        /// </summary>
        public string Workflow { get; set; }

        /// <summary>
        /// get/set - The status of the project.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The agency name this project belongs to.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The project description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The parcel land legal description.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - Risk value.
        /// </summary>
        public string Risk { get; set; }

        /// <summary>
        /// get/set - The project manager information.
        /// </summary>
        public string Manager { get; set; }

        /// <summary>
        /// get/set - The location of the project.
        /// </summary>
        public string Location { get; set; }
        #endregion

        #region Dates
        /// <summary>
        /// get/set - The date the project was completed.
        /// </summary>
        public DateTime? CompletedOn { get; set; }

        /// <summary>
        /// get/set - The date the project was disposed.
        /// </summary>
        public DateTime? DisposedOn { get; set; }
        #endregion

        #region Notes
        /// <summary>
        /// get/set - Collection of notes whose type is identified by their 'key'.
        /// </summary>
        public ICollection<KeyValuePair<string, string>> Notes { get; set; } = new List<KeyValuePair<string, string>>();
        #endregion

        #region ERP
        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public bool ExemptionRequested { get; set; }

        /// <summary>
        /// get/set - When the initial enhanced referral notification was sent.
        /// </summary>
        public DateTime? InitialNotificationSentOn { get; set; }

        /// <summary>
        /// get/set - When interest was received on.
        /// </summary>
        public DateTime? InterestedReceivedOn { get; set; }

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
        /// get/set - The date the project was marketed.
        /// </summary>
        public DateTime? MarketedOn { get; set; }

        /// <summary>
        /// get/set - Text field describing project purchaser.
        /// </summary>
        public string Purchaser { get; set; }

        /// <summary>
        /// get/set - Whether or not the contract for the project is conditional
        /// </summary>
        public bool? IsContractConditional { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The market value.
        /// </summary>
        public decimal Market { get; set; }

        /// <summary>
        /// get/set - The net book value.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal? Assessed { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal? Appraised { get; set; }

        /// <summary>
        /// get/set - The firm that did the appraisal.
        /// </summary>
        public string AppraisedBy { get; set; }

        /// <summary>
        /// get/set - The date the appraisal was provided.
        /// </summary>
        public DateTime? AppraisedOn { get; set; }

        /// <summary>
        /// get/set - The program costs of the sale.
        /// </summary>
        public decimal? ProgramCost { get; set; }

        /// <summary>
        /// get/set - The gain or loss of the sale.
        /// </summary>
        public decimal? GainLoss { get; set; }

        /// <summary>
        /// get/set - The interest component of the sale.
        /// </summary>
        public decimal? InterestComponent { get; set; }

        /// <summary>
        /// get/set - Costs of the sale.
        /// </summary>
        public decimal? SalesCost { get; set; }

        /// <summary>
        /// get/set - The net proceeds of the sale.
        /// </summary>
        public decimal NetProceeds { get; set; }

        /// <summary>
        /// get/set - The prior reported net proceeds of the sale.
        /// </summary>
        public decimal? PriorNetProceeds { get; set; }

        /// <summary>
        /// get/set - The variance between the prior net proceeds and the current net proceeds.
        /// </summary>
        public decimal? Variance { get; set; }

        /// <summary>
        /// get/set - OCG financial statement value.
        /// </summary>
        public decimal? OcgFinancialStatement { get; set; }

        /// <summary>
        /// get/set - Whether the sale included a lease in the price.
        /// </summary>
        public bool SaleWithLeaseInPlace { get; set; }

        /// <summary>
        /// get/set - The date to create the prior snapshot for.
        /// </summary>
        public DateTime? SnapshotOn { get; set; }
        #endregion

        #endregion
    }
}
