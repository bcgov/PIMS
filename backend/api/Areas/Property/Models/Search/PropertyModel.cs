using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Property.Models.Search
{
    /// <summary>
    /// PropertyModel class, provides a model to represent the property whether Land or Building.
    /// </summary>
    public class PropertyModel
    {
        #region Properties
        #region Identification
        /// <summary>
        /// get/set - The primary key to identify the property.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The concurrency row version.
        /// </summary>
        /// <value></value>
        public string RowVersion { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property type [Land, Building].
        /// </summary>
        public int PropertyTypeId { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status of the property.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property classification.
        /// </summary>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification of the property.
        /// </summary>
        public string Classification { get; set; }

        /// <summary>
        /// get/set - The GIS latitude location of the property.
        /// </summary>
        public double? Latitude { get; set; }

        /// <summary>
        /// get/set - The GIS latitude location of the property.
        /// </summary>
        public double? Longitude { get; set; }

        /// <summary>
        /// get/set - The property name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The property project numbers.
        /// </summary>
        public IEnumerable<string> ProjectNumbers { get; set; }

        /// <summary>
        /// get/set - The property project status.
        /// </summary>
        public string ProjectStatus { get; set; }

        /// <summary>
        /// get/set - The workflow code of this project, if in a project.
        /// </summary>
        public string ProjectWorkflow { get; set; }

        /// <summary>
        /// get/set - Whether the property is sensitive data.
        /// </summary>
        public bool IsSensitive { get; set; }
        #endregion

        #region Agency
        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The owning agency name.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The owning agency code.
        /// </summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The owning subagency name.
        /// </summary>
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The owning subagency code.
        /// </summary>
        public string SubAgencyCode { get; set; }
        #endregion

        #region Address
        /// <summary>
        /// get/set - The foreign key to the address.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address of the property.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The name of the administrative area (city, municipality, district, etc.).
        /// </summary>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The name of the province.
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// get/set - The postal code.
        /// </summary>
        public string Postal { get; set; }
        #endregion

        #region Parcel Properties
        /// <summary>
        /// get/set - A unique identifier for the titled parcel.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - A unique identifier for an untitled parcel.
        /// </summary>
        public string PIN { get; set; }

        /// <summary>
        /// get/set - The land area of the parcel.
        /// </summary>
        public float? LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description of the parcel.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - The property zoning name.
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - The property zoning potential.
        /// </summary>
        public string ZoningPotential { get; set; }
        #endregion

        #region Building Properties
        /// <summary>
        /// get/set - Foreign key to the construction type.
        /// </summary>
        public int? ConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - The construction type name.
        /// </summary>
        public string ConstructionType { get; set; }

        /// <summary>
        /// get/set - The foreign key to the predominate use.
        /// </summary>
        public int? PredominateUseId { get; set; }

        /// <summary>
        /// get/set - The predominate use name.
        /// </summary>
        public string PredominateUse { get; set; }

        /// <summary>
        /// get/set - The foreign key to the occupant type.
        /// </summary>
        public int? OccupantTypeId { get; set; }

        /// <summary>
        /// get/set - The occupant type name.
        /// </summary>
        public string OccupantType { get; set; }

        /// <summary>
        /// get/set - The number of floors in the building.
        /// </summary>
        public int? FloorCount { get; set; }

        /// <summary>
        /// get/set - A description of the building tenancy.
        /// </summary>
        public string Tenancy { get; set; }

        /// <summary>
        /// get/set - The name of the occupant.
        /// </summary>
        public string OccupantName { get; set; }

        /// <summary>
        /// get/set - The date the lease expires.
        /// </summary>
        public DateTime? LeaseExpiry { get; set; }

        /// <summary>
        /// get/set - Whether the lease will transfer with the sale.
        /// </summary>
        public bool? TransferLeaseOnSale { get; set; }

        /// <summary>
        /// get/set - The square feet of rentable area in the building.
        /// </summary>
        public float? RentableArea { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The property market value.
        /// </summary>
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The fiscal year of the market value.
        /// </summary>
        public int? MarketFiscalYear { get; set; }

        /// <summary>
        /// get/set - The property netbook value.
        /// </summary>
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The fiscal year of the netbook value.
        /// </summary>
        public int? NetBookFiscalYear { get; set; }

        /// <summary>
        /// get/set - The property assessed value.
        /// </summary>
        public decimal? AssessedLand { get; set; }

        /// <summary>
        /// get/set - The date when the assessment occured.
        /// </summary>
        public DateTime? AssessedLandDate { get; set; }

        /// <summary>
        /// get/set - The property appraised value.
        /// </summary>
        public decimal? AssessedBuilding { get; set; }

        /// <summary>
        /// get/set - the date when the appraisal occured.
        /// </summary>
        public DateTime? AssessedBuildingDate { get; set; }
        #endregion
        #endregion
    }
}
