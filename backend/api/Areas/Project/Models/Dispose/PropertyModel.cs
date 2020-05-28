using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Pims.Api.Models.Parcel;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    public class PropertyModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key to identify the property.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property type [Land, Building].
        /// </summary>
        public int PropertyTypeId { get; set; }

        /// <summary>
        /// get/set - A unique identifier for the titled parcel.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - A unique identifier for an untitled parcel.
        /// </summary>
        public string PIN { get; set; }

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
        public double Latitude { get; set; }

        /// <summary>
        /// get/set - The GIS latitude location of the property.
        /// </summary>
        public double Longitude { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The property project number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - Whether the property is sensitive data.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int AgencyId { get; set; }

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

        /// <summary>
        /// get/set - The foreign key to the address.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The foreign key to the address.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The name of the city.
        /// </summary>
        public string City { get; set; }

        /// <summary>
        /// get/set - The name of the province.
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// get/set - The postal code.
        /// </summary>
        public string Postal { get; set; }

        /// <summary>
        /// get/set - The property estimated value.
        /// </summary>
        public float Estimated { get; set; }

        /// <summary>
        /// get/set - The fiscal year of the estimated value.
        /// </summary>
        public int? EstimatedFiscalYear { get; set; }

        /// <summary>
        /// get/set - The row version of the estimated value.
        /// </summary>
        public string EstimatedRowVersion { get; set; }

        /// <summary>
        /// get/set - The property netbook value.
        /// </summary>
        public float NetBook { get; set; }

        /// <summary>
        /// get/set - The fiscal year of the netbook value.
        /// </summary>
        public int? NetBookFiscalYear { get; set; }

        /// <summary>
        /// get/set - The row version of the netbook value.
        /// </summary>
        public string NetBookRowVersion { get; set; }

        /// <summary>
        /// get/set - The property assessed value.
        /// </summary>
        public float Assessed { get; set; }

        /// <summary>
        /// get/set - The date when the assessment occured.
        /// </summary>
        public DateTime? AssessedDate { get; set; }

        /// <summary>
        /// get/set - The property assessed row version.
        /// </summary>
        public string AssessedRowVersion { get; set; }

        /// <summary>
        /// get/set - The property appraised value.
        /// </summary>
        public float Appraised { get; set; }

        /// <summary>
        /// get/set - The property appraised row version.
        /// </summary>
        public string AppraisedRowVersion { get; set; }

        /// <summary>
        /// get/set - the date when the appraisal occured.
        /// </summary>
        public DateTime? AppraisedDate { get; set; }

        #region Parcel Properties
        /// <summary>
        /// get/set - The land area of the parcel.
        /// </summary>
        public float LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description of the parcel.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - The property municipality name.
        /// </summary>
        public string Municipality { get; set; }

        /// <summary>
        /// get/set - The property zoning name.
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - The property zoning potential.
        /// </summary>
        public string ZoningPotential { get; set; }

        /// <summary>
        /// get/set - An array of fiscals associated with this project parcel.
        /// </summary>
        public IEnumerable<ParcelFiscalModel> ParcelFiscals { get; set; } = new List<ParcelFiscalModel>();

        /// <summary>
        /// get/set - An array of evaluations associated with this project parcel.
        /// </summary>
        public IEnumerable<ParcelEvaluationModel> ParcelEvaluations { get; set; } = new List<ParcelEvaluationModel>();
        #endregion

        #region Building Properties
        /// <summary>
        /// get/set - Local building unique identifier.
        /// </summary>
        public string LocalId { get; set; }

        /// <summary>
        /// get/set - The parent parcel Id.
        /// </summary>
        public int? ParcelId { get; set; }

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

        /// <summary>
        /// get/set - An array of fiscals associated with this project parcel.
        /// </summary>
        public IEnumerable<ParcelFiscalModel> BuildingFiscals { get; set; } = new List<ParcelFiscalModel>();

        /// <summary>
        /// get/set - An array of evaluations associated with this project parcel.
        /// </summary>
        public IEnumerable<ParcelEvaluationModel> BuildingEvaluations { get; set; } = new List<ParcelEvaluationModel>();
        #endregion
        #endregion
    }
}
