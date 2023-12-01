namespace Pims.Api.Areas.Tools.Models.Import
{
    public class ImportPropertyModel
    {
        #region Properties
        public bool Updated { get; set; }
        public bool Added { get; set; }
        public string ParcelId { get; set; }
        public string PID { get; set; }
        public string PIN { get; set; }
        public string Status { get; set; }
        public int FiscalYear { get; set; }
        public string Agency { get; set; }
        public string AgencyCode { get; set; }
        public string SubAgency { get; set; }
        public string PropertyType { get; set; }
        public string LocalId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Classification { get; set; }
        public string CivicAddress { get; set; }
        public string City { get; set; }
        public string Postal { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public float LandArea { get; set; }
        public string LandLegalDescription { get; set; }
        public int BuildingFloorCount { get; set; }
        public string BuildingConstructionType { get; set; }
        public string BuildingPredominateUse { get; set; }
        public string BuildingTenancy { get; set; }
        public float BuildingRentableArea { get; set; }
        public decimal Assessed { get; set; }
        public decimal NetBook { get; set; }
        public string RegionalDistrict { get; set; }
        public string Error { get; set; }
        #endregion
    }
}
