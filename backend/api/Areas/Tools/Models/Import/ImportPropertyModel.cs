namespace Pims.Api.Areas.Tools.Models.Import
{
    public class ImportPropertyModel
    {
        #region Properties
        public string Status { get; set; }
        public string FiscalYear { get; set; }
        public string Agency { get; set; }
        public string SubAgency { get; set; }
        public string PropertyType { get; set; }
        public string ParcelId { get; set; }
        public string LocalId { get; set; }
        public string Description { get; set; }
        public string AssessedValue { get; set; }
        public string Classification { get; set; }
        public string CivicAddress { get; set; }
        public string City { get; set; }
        public string Postal { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string LandArea { get; set; }
        public string LandLegalDescription { get; set; }
        public string BuildingFloorCount { get; set; }
        public string BuildingConstructionType { get; set; }
        public string BuildingPredominateUse { get; set; }
        public string BuildingTenancy { get; set; }
        public string BuildingRentableArea { get; set; }
        public string NetBookValue { get; set; }
        #endregion
    }
}
