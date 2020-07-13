using System;

namespace Pims.Api.Areas.Tools.Models.Import
{
    public class ImportProjectModel
    {
        #region Properties
        public string ProjectNumber { get; set; }
        public int ActualFiscalYear { get; set; }
        public string MajorActivity { get; set; }
        public string Workflow { get; set; }
        public string Status { get; set; }
        public string Agency { get; set; }
        public string Description { get; set; }
        public decimal Estimated { get; set; }
        public decimal NetBook { get; set; }
        public decimal SalesCost { get; set; }
        public decimal NetProceeds { get; set; }
        public decimal? Variance { get; set; }
        public string Risk { get; set; }
        public DateTime? MarketedOn { get; set; }
        public DateTime? CompletedOn { get; set; }
        public string PrivateNote { get; set; }
        public string ItemType { get; set; }
        public string Path { get; set; }
        public decimal? PriorNetProceeds { get; set; }
        public decimal ProgramCost { get; set; }
        public decimal GainLoss { get; set; }
        public decimal? OcgFinancialStatement { get; set; }
        public decimal InterestComponent { get; set; }
        public int ReportedFiscalYear { get; set; }
        public string Manager { get; set; }
        public bool SaleWithLeaseInPlace { get; set; }
        public string FinancialNote { get; set; }
        public DateTime? AgencyResponseDate { get; set; }
        #endregion
    }
}
