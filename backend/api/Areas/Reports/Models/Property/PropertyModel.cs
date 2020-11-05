using Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Reports.Models.Property
{
    public class PropertyModel
    {
        #region Properties
        public PropertyTypes Type { get; set; }
        public string Status { get; set; }
        public string Classification { get; set; }
        public string Description { get; set; }
        public string Agency { get; set; }
        public string Address { get; set; }
        public string AdministrativeArea { get; set; }
        public string Postal { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsSensitive { get; set; }

        public decimal Assessed { get; set; }
        public decimal Estimated { get; set; }


        #region Parcel Properties
        public string PID { get; set; }
        public int? PIN { get; set; }
        public float LandArea { get; set; }
        public string LandLegalDescription { get; set; }
        public string Zoning { get; set; }
        public string ZoningPotential { get; set; }
        #endregion

        #region Building Properties
        public string BuildingConstructionType { get; set; }
        public string BuildingPredominateUse { get; set; }
        public string BuildingOccupantType { get; set; }
        public string BuildingTenancy { get; set; }
        public float RentableArea { get; set; }
        public string OccupantName { get; set; }
        public DateTime? LeaseExpiry { get; set; }
        public bool TransferLeaseOnSale { get; set; }
        #endregion
        #endregion
    }
}
