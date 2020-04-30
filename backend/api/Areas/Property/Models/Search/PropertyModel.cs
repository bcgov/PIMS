using System;

namespace Pims.Api.Areas.Property.Models.Search
{
    public class PropertyModel
    {
        #region Properties
        public int Id { get; set; }

        public int PropertyTypeId { get; set; }

        public string PID { get; set; }

        public string PIN { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }

        public int ClassificationId { get; set; }

        public string Classification { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        public string ProjectNumber { get; set; }

        public bool IsSensitive { get; set; }

        public int AgencyId { get; set; }

        public string Agency { get; set; }

        public string AgencyCode { get; set; }

        public string SubAgency { get; set; }

        public string SubAgencyCode { get; set; }

        public int AddressId { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string Province { get; set; }

        public string Postal { get; set; }

        public decimal Estimated { get; set; }

        public int? EstimatedFiscalYear { get; set; }

        public decimal NetBook { get; set; }

        public int? NetBookFiscalYear { get; set; }

        public decimal Assessed { get; set; }

        public DateTime? AssessedDate { get; set; }

        public decimal Appraised { get; set; }

        public DateTime? AppraisedDate { get; set; }

        #region Parcel Properties
        public float LandArea { get; set; }

        public string LandLegalDescription { get; set; }

        public string Municipality { get; set; }

        public string Zoning { get; set; }

        public string ZoningPotential { get; set; }
        #endregion

        #region Building Properties
        public string LocalId { get; set; }

        public int? ConstructionTypeId { get; set; }

        public string ConstructionType { get; set; }

        public int? PredominateUseId { get; set; }

        public string PredominateUse { get; set; }

        public int? OccupantTypeId { get; set; }

        public string OccupantType { get; set; }

        public int? FloorCount { get; set; }

        public string Tenancy { get; set; }

        public string OccupantName { get; set; }

        public DateTime? LeaseExpiry { get; set; }

        public bool? TransferLeaseOnSale { get; set; }

        public float? RentableArea { get; set; }
        #endregion
        #endregion
    }
}
