using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using NetTopologySuite.Geometries;

namespace Pims.Dal.Entities.Views
{
    /// <summary>
    /// Property class, provides a model that represents a view in the database.
    /// </summary>
    public class Property
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The concurrency row version.
        /// </summary>
        /// <value></value>
        public byte[] RowVersion { get; set; }

        /// <summary>
        /// get/set - The property type [0=Parcel, 1=Building].
        /// </summary>
        public PropertyTypes PropertyTypeId { get; set; }

        /// <summary>
        /// get/set - The RAEG/SPP project number.
        /// </summary>
        public string ProjectNumbers { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property classification.
        /// </summary>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification for this property.
        /// </summary>
        public string Classification { get; set; }

        /// <summary>
        /// get/set - The foreign key to the agency that owns this property.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The parent agency this property belongs to.
        /// /summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The parent agency code this property belongs to.
        /// /summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The sub agency this property belongs to.
        /// /summary>
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The sub agency code this property belongs to.
        /// /summary>
        public string SubAgencyCode { get; set; }

        /// <summary>
        /// get/set - The property name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property address.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The administrative area (city, municipality, district, etc) for this property.
        /// </summary>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public string Postal { get; set; }

        /// <summary>
        /// get/set - The location of the property.
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// get/set - The property boundary polygon.
        /// </summary>
        public Geometry Boundary { get; set; }

        /// <summary>
        /// get/set - Whether this property is considered sensitive and should only be visible to users who are part of the owning agency.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - Whether the property is visible to other agencies.  This is used to make properties visible during ERP, but can be used at other times too.
        /// </summary>
        public bool IsVisibleToOtherAgencies { get; set; }

        #region Financials
        /// <summary>
        /// get/set - The most recent market value.
        /// </summary>
        [Column(TypeName = "MONEY")]
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The fiscal year for the market value.
        /// </summary>
        public int? MarketFiscalYear { get; set; }

        /// <summary>
        /// get/set - The most recent netbook value.
        /// </summary>
        [Column(TypeName = "MONEY")]
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The fiscal year netbook value.
        /// </summary>
        public int? NetBookFiscalYear { get; set; }

        /// <summary>
        /// get/set - The most recent assessment for the land.
        /// </summary>
        [Column(TypeName = "MONEY")]
        public decimal? AssessedLand { get; set; }

        /// <summary>
        /// get/set - When the most recent assessment was taken.
        /// </summary>
        public DateTime? AssessedLandDate { get; set; }

        /// <summary>
        /// get/set - The most recent assessment for the building and improvements.
        /// </summary>
        [Column(TypeName = "MONEY")]
        public decimal? AssessedBuilding { get; set; }

        /// <summary>
        /// get/set - When the most recent assessment was taken.
        /// </summary>
        public DateTime? AssessedBuildingDate { get; set; }
        #endregion

        #region Parcel Properties
        /// <summary>
        /// get/set - The property identification number for Titled land.
        /// </summary>
        public int? PID { get; set; }

        /// <summary>
        /// get - The friendly formated Parcel Id.
        /// </summary>
        public string ParcelIdentity { get { return this.PID > 0 ? $"{this.PID:000-000-000}" : null; } }

        /// <summary>
        /// get/set - The property identification number of Crown Lands Registry that are not Titled.
        /// </summary>
        /// <value></value>
        public int? PIN { get; set; }

        /// <summary>
        /// get/set - The land area.
        /// </summary>
        public float? LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - Current Parcel zoning information
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - Potential future Parcel zoning information
        /// </summary>
        public string ZoningPotential { get; set; }
        #endregion

        #region Building Properties
        /// <summary>
        /// get/set - The parent parcel Id.
        /// </summary>
        public int? ParcelId { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property building construction type.
        /// </summary>
        public int? BuildingConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - The building construction type for this property.
        /// </summary>
        public string BuildingConstructionType { get; set; }

        /// <summary>
        /// get/set - The number of floors in the building.
        /// </summary>
        public int? BuildingFloorCount { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building predominant use.
        /// </summary>
        public int? BuildingPredominateUseId { get; set; }

        /// <summary>
        /// get/set - The building predominant use for this building.
        /// </summary>
        public string BuildingPredominateUse { get; set; }

        /// <summary>
        /// get/set - The type of tenancy for this building.
        /// </summary>
        public string BuildingTenancy { get; set; }

        /// <summary>
        /// get/set - The building rentable area.
        /// </summary>
        public float? RentableArea { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building occupant type.
        /// </summary>
        public int? BuildingOccupantTypeId { get; set; }

        /// <summary>
        /// get/set - The type of occupant for this building.
        /// </summary>
        public string BuildingOccupantType { get; set; }

        /// <summary>
        /// get/set - The expiry date of the currently active lease
        /// </summary>
        public DateTime? LeaseExpiry { get; set; }

        /// <summary>
        /// get/set - The name of the occupant/organization
        /// </summary>
        public string OccupantName { get; set; }

        /// <summary>
        /// get/set - Whether the lease on this building would be transferred if the building is sold.
        /// </summary>
        public bool? TransferLeaseOnSale { get; set; }
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Property object.
        /// </summary>
        public Property()
        {

        }

        /// <summary>
        /// Creates a new instance of a Property object, initializes it with the specified arguments.
        /// </summary>
        /// <param name="property"></param>
        public Property(Entities.Property property)
        {
            this.Id = property.Id;
            this.ProjectNumbers = property.ProjectNumbers;
            this.ClassificationId = property.ClassificationId;
            this.Classification = property.Classification?.Name;

            this.AgencyId = property.AgencyId;
            this.Agency = property.Agency?.ParentId != null ? property.Agency.Parent?.Name : property.Agency?.Name;
            this.AgencyCode = property.Agency?.ParentId != null ? property.Agency.Parent?.Code : property.Agency?.Code;
            this.SubAgency = property.Agency?.ParentId != null ? null : property.Agency?.Name;
            this.SubAgencyCode = property.Agency?.ParentId != null ? null : property.Agency?.Code;

            this.Name = property.Name;
            this.Description = property.Description;
            this.AddressId = property.AddressId;
            this.Address = property.Address != null ? $"{property.Address?.Address1} {property.Address?.Address2}".Trim() : null;
            this.AdministrativeArea = property.Address?.AdministrativeArea;
            this.Province = property.Address?.Province?.Name;
            this.Postal = property.Address?.Postal;
            this.Location = property.Location;
            this.Boundary = property.Boundary;
            this.IsSensitive = property.IsSensitive;
        }

        /// <summary>
        /// Creates a new instance of a Property object, initializes it with the specified arguments.
        /// </summary>
        /// <param name="parcel"></param>
        public Property(Parcel parcel) : this((Entities.Property)parcel)
        {
            this.PropertyTypeId = PropertyTypes.Land;
            this.PID = parcel.PID;
            this.PIN = parcel.PIN;
            this.LandArea = parcel.LandArea;
            this.LandLegalDescription = parcel.LandLegalDescription;
            this.Zoning = parcel.Zoning;
            this.ZoningPotential = parcel.ZoningPotential;

            var assessed = parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);
            this.AssessedLand = assessed?.Value;
            this.AssessedLandDate = assessed?.Date;

            var improvements = parcel.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Improvements);
            this.AssessedBuilding = improvements?.Value;
            this.AssessedBuildingDate = improvements?.Date;
        }

        /// <summary>
        /// Creates a new instance of a Property object, initializes it with the specified arguments.
        /// </summary>
        /// <param name="building"></param>
        public Property(Building building) : this((Entities.Property)building)
        {
            this.PropertyTypeId = PropertyTypes.Building;
            this.PID = building.Parcels.FirstOrDefault()?.Parcel.PID ?? 0;
            this.PIN = building.Parcels.FirstOrDefault()?.Parcel.PIN;
            this.ParcelId = building.Parcels.FirstOrDefault()?.ParcelId;
            this.BuildingConstructionTypeId = building.BuildingConstructionTypeId;
            this.BuildingConstructionType = building.BuildingConstructionType?.Name;
            this.BuildingFloorCount = building.BuildingFloorCount;
            this.BuildingPredominateUseId = building.BuildingPredominateUseId;
            this.BuildingPredominateUse = building.BuildingPredominateUse?.Name;
            this.BuildingTenancy = building.BuildingTenancy;
            this.RentableArea = building.RentableArea;
            this.BuildingOccupantTypeId = building.BuildingOccupantTypeId;
            this.BuildingOccupantType = building.BuildingOccupantType?.Name;
            this.LeaseExpiry = building.LeaseExpiry;
            this.OccupantName = building.OccupantName;
            this.TransferLeaseOnSale = building.TransferLeaseOnSale;

            var improvements = building.Evaluations.OrderByDescending(e => e.Date).FirstOrDefault(e => e.Key == EvaluationKeys.Assessed);
            this.AssessedBuilding = improvements?.Value;
            this.AssessedBuildingDate = improvements?.Date;
        }
        #endregion
    }
}
