namespace Pims.Api.Areas.Tools.Models
{
    public class PropertyModel
    {
        #region Properties
        public string Status { get; set; }
        public int FiscalYear { get; set; }
        public string Agency { get; set; }
        public string SubAgency { get; set; }
        public string PropertyType { get; set; }
        public string ParcelId { get; set; }
        public string LocalId { get; set; }
        public string Description { get; set; }
        public double AssessedValue { get; set; }
        public string Classification { get; set; }
        public string CivicAddress { get; set; }
        public string City { get; set; }
        public string Postal { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public float LandArea { get; set; } // TODO: Check if buildings should have this property.
        public string LandLegalDescription { get; set; }
        public int BuildingFloorCount { get; set; }
        #endregion
    }
}
