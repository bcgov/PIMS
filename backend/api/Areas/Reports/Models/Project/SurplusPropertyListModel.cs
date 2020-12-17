using System;
using System.ComponentModel;

namespace Pims.Api.Areas.Reports.Models.Project
{
    /// <summary>
    /// SurplusPropertyListModel class, provides a model to represent the project.
    /// </summary>
    public class SurplusPropertyListModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique project number to identify the project.
        /// </summary>
        [DisplayName("RAEG#")]
        [CsvHelper.Configuration.Attributes.Name("RAEG#")]
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The actual fiscal year this project was completed, or the forecasted.
        /// </summary>
        [DisplayName("FY")]
        [CsvHelper.Configuration.Attributes.Name("FY")]
        public string ActualFiscalYear { get; set; }

        [DisplayName("Major_Activity")]
        [CsvHelper.Configuration.Attributes.Name("Major_Activity")]
        public string MajorActivity { get; set; }

        [DisplayName("Sales_Status")]
        [CsvHelper.Configuration.Attributes.Name("Sales_Status")]
        public string Status { get; set; }

        [DisplayName("Sector")]
        [CsvHelper.Configuration.Attributes.Name("Sector")]
        public string AgencyCode { get; set; }

        [DisplayName("Description")]
        [CsvHelper.Configuration.Attributes.Name("Description")]
        public string Name { get; set; }

        [DisplayName("CMV")]
        [CsvHelper.Configuration.Attributes.Name("CMV")]
        public decimal CurrentMarketValue { get; set; }

        [DisplayName("NBV")]
        [CsvHelper.Configuration.Attributes.Name("NBV")]
        public decimal NetBookValue { get; set; }

        [DisplayName("Sales_Cost")]
        [CsvHelper.Configuration.Attributes.Name("Sales_Cost")]
        public decimal? SalesCost { get; set; }

        [DisplayName("Net_Proceeds")]
        [CsvHelper.Configuration.Attributes.Name("Net_Proceeds")]
        public decimal? NetProceeds { get; set; }

        [DisplayName("Baseline_Integrity_Check")]
        [CsvHelper.Configuration.Attributes.Name("Baseline_Integrity_Check")]
        public decimal? BaselineIntegrityCheck { get; set; }

        [DisplayName("Status")]
        [CsvHelper.Configuration.Attributes.Name("Status")]
        public string Risk { get; set; }

        [DisplayName("Marketing_Start")]
        [CsvHelper.Configuration.Attributes.Name("Marketing_Start")]
        public DateTime? MarketedOn { get; set; }

        [DisplayName("Comp_Date")]
        [CsvHelper.Configuration.Attributes.Name("Comp_Date")]
        public DateTime? CompletedOn { get; set; }

        [DisplayName("Comment_Weekly_Review")]
        [CsvHelper.Configuration.Attributes.Name("Comment_Weekly_Review")]
        public string ReportingNote { get; set; }

        [DisplayName("Item Type")]
        [CsvHelper.Configuration.Attributes.Name("Item Type")]
        public string ItemType { get; set; }

        [DisplayName("Path")]
        [CsvHelper.Configuration.Attributes.Name("Path")]
        public string Path { get; set; }

        [DisplayName("Weekly_Integrity_Check")]
        [CsvHelper.Configuration.Attributes.Name("Weekly_Integrity_Check")]
        public decimal? WeeklyIntegrityCheck { get; set; }

        [DisplayName("Program_Cost")]
        [CsvHelper.Configuration.Attributes.Name("Program_Cost")]
        public decimal? ProgramCost { get; set; }

        [DisplayName("Gain_(Loss)")]
        [CsvHelper.Configuration.Attributes.Name("Gain_(Loss)")]
        public decimal? GainLoss { get; set; }

        [DisplayName("OCG_Fin_Stmts")]
        [CsvHelper.Configuration.Attributes.Name("OCG_Fin_Stmts")]
        public decimal? OcgFinancialStatement { get; set; }

        [DisplayName("Interest_Component")]
        [CsvHelper.Configuration.Attributes.Name("Interest_Component")]
        public decimal? InterestComponent { get; set; }

        /// <summary>
        /// get/set - The reported fiscal year this project.
        /// </summary>
        [DisplayName("Rpt_FY")]
        [CsvHelper.Configuration.Attributes.Name("Rpt_FY")]
        public string ReportedFiscalYear { get; set; }

        [DisplayName("SLIP")]
        [CsvHelper.Configuration.Attributes.Name("SLIP")]
        public bool Slip { get; set; }

        [DisplayName("Manager")]
        [CsvHelper.Configuration.Attributes.Name("Manager")]
        public string Manager { get; set; }

        [DisplayName("Financial_Notes")]
        [CsvHelper.Configuration.Attributes.Name("Financial_Notes")]
        public string FinancialNote { get; set; }

        [DisplayName("Interest from Enhanced Referral")]
        [CsvHelper.Configuration.Attributes.Name("Interest from Enhanced Referral")]
        public string InterestFromEnhancedReferralNote { get; set; }

        [DisplayName("Date of Interest Rcvd")]
        [CsvHelper.Configuration.Attributes.Name("Date of Interest Rcvd")]
        public DateTime? InterestedReceivedOn { get; set; }
        #endregion
    }
}
