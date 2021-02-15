using Pims.Dal.Entities;
using System;
using System.ComponentModel;

namespace Pims.Api.Areas.Reports.Models.AllPropertyFields
{
    public class AllFieldsPropertyModel
    {
        #region Properties
        /// <summary>
        /// get/set - The type of property [Land, Building].
        /// </summary>
        /// <value></value>
        public PropertyTypes Type { get; set; }

        /// <summary>
        /// get/set - The status of the property.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The project number
        /// </summary>
        [DisplayName("Project Number")]
        [CsvHelper.Configuration.Attributes.Name("Project Number")]
        public string ProjectNumbers { get; set; }

        /// <summary>
        /// get/set - The current classification.
        /// </summary>
        public string Classification { get; set; }

        /// <summary>
        /// get/set - The name of the property.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A description of the property.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The owning agency full name.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The owning agency code.
        /// </summary>
        [DisplayName("Agency Code")]
        [CsvHelper.Configuration.Attributes.Name("Agency Code")]
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The sub-agency full name.
        /// </summary>
        [DisplayName("Sub Agency")]
        [CsvHelper.Configuration.Attributes.Name("Sub Agency")]
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The sub-agency code.
        /// </summary>
        [DisplayName("Sub Agency Code")]
        [CsvHelper.Configuration.Attributes.Name("Sub Agency Code")]
        public string SubAgencyCode { get; set; }

        /// <summary>
        /// get/set - The civic address of the property.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The location of the property (city, municipality, district, etc)
        /// </summary>
        [DisplayName("Location")]
        [CsvHelper.Configuration.Attributes.Name("Location")]
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The province of the property
        /// </summary>
        public string Province { get; set; }

        /// <summary>
        /// get/set - The postal code.
        /// </summary>
        public string Postal { get; set; }

        /// <summary>
        /// get/set - The latitude location.
        /// </summary>
        public double Latitude { get; set; }

        /// <summary>
        /// get/set - The longitude location.
        /// </summary>
        public double Longitude { get; set; }

        /// <summary>
        /// get/set - Whether the property is sensitive.
        /// </summary>
        [DisplayName("Sensitive")]
        [CsvHelper.Configuration.Attributes.Name("Sensitive")]
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - Whether the property is visible to other agencies outside the owning one.
        /// </summary>
        [DisplayName("Visible to Other Agencies")]
        [CsvHelper.Configuration.Attributes.Name("Visible to Other Agencies")]
        public bool IsVisibleToOtherAgencies { get; set; }

        #region Financials
        /// <summary>
        /// get/set - The most recent assessed land value.
        /// </summary>
        [DisplayName("Assessed Land Value")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Land Value")]
        public decimal? AssessedLand { get; set; }

        /// <summary>
        /// get/set - When the most recent assessment was taken.
        /// </summary>
        [DisplayName("Assessed Land Date")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Land Date")]
        public DateTime? AssessedLandDate { get; set; }

        /// <summary>
        /// get/set - The most recent assessed building value.
        /// </summary>
        [DisplayName("Assessed Building Value")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Building Value")]
        public decimal? AssessedBuilding { get; set; }

        /// <summary>
        /// get/set - When the most recent assessment was taken.
        /// </summary>
        [DisplayName("Assessed Building Date")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Building Date")]
        public DateTime? AssessedBuildingDate { get; set; }

        /// <summary>
        /// get/set - The most recent market value.
        /// </summary>
        [DisplayName("Market Value")]
        [CsvHelper.Configuration.Attributes.Name("Market Value")]
        public decimal Market { get; set; }

        /// <summary>
        /// get/set - The fiscal year for the market value.
        /// </summary>
        [DisplayName("Market Fiscal Year")]
        [CsvHelper.Configuration.Attributes.Name("Market Fiscal Year")]
        public int? MarketFiscalYear { get; set; }

        /// <summary>
        /// get/set - The most recent netbook value.
        /// </summary>
        [DisplayName("Net Book Value")]
        [CsvHelper.Configuration.Attributes.Name("Net Book Value")]
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The fiscal year netbook value.
        /// </summary>
        [DisplayName("Net Book Fiscal Year")]
        [CsvHelper.Configuration.Attributes.Name("Net Book Fiscal Year")]
        public int? NetBookFiscalYear { get; set; }
        #endregion

        #region Parcel Properties
        /// <summary>
        /// get/set - The parcel PID.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - The PIN if the parcel is not titled.
        /// </summary>
        public int? PIN { get; set; }

        /// <summary>
        /// get/set - The land area.
        /// </summary>
        [DisplayName("Land Area")]
        [CsvHelper.Configuration.Attributes.Name("Land Area")]
        public float LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description.
        /// </summary>
        [DisplayName("Legal Description")]
        [CsvHelper.Configuration.Attributes.Name("Legal Description")]
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - The current zoning.
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - Potential future Parcel zoning information
        /// </summary>
        [DisplayName("Zoning Potential")]
        [CsvHelper.Configuration.Attributes.Name("Zoning Potential")]
        public string ZoningPotential { get; set; }
        #endregion

        #region Building Properties
        /// <summary>
        /// get/set - The building construction type.
        /// </summary>
        [DisplayName("Construction Type")]
        [CsvHelper.Configuration.Attributes.Name("Construction Type")]
        public string BuildingConstructionType { get; set; }

        /// <summary>
        /// get/set - The parent parcel Id.
        /// </summary>
        [DisplayName("Parcel Id")]
        [CsvHelper.Configuration.Attributes.Name("Parcel Id")]
        public int? ParcelId { get; set; }

        /// <summary>
        /// get/set - The building predominate use.
        /// </summary>
        [DisplayName("Predominate Use")]
        [CsvHelper.Configuration.Attributes.Name("Predominate Use")]
        public string BuildingPredominateUse { get; set; }

        /// <summary>
        /// get/set - The building occupant type.
        /// </summary>
        [DisplayName("Occupant Type")]
        [CsvHelper.Configuration.Attributes.Name("Occupant Type")]
        public string BuildingOccupantType { get; set; }

        /// <summary>
        /// get/set - The building tenancy.
        /// </summary>
        [DisplayName("Tenancy")]
        [CsvHelper.Configuration.Attributes.Name("Tenancy")]
        public string BuildingTenancy { get; set; }

        /// <summary>
        /// get/set - The building rentable area.
        /// </summary>
        [DisplayName("Rentable Area")]
        [CsvHelper.Configuration.Attributes.Name("Rentable Area")]
        public float RentableArea { get; set; }

        /// <summary>
        /// get/set - The building occupant name.
        /// </summary>
        [DisplayName("Occupant")]
        [CsvHelper.Configuration.Attributes.Name("Occupant")]
        public string OccupantName { get; set; }

        /// <summary>
        /// get/set - The building lease expiry date.
        /// </summary>
        [DisplayName("Lease Expiry")]
        [CsvHelper.Configuration.Attributes.Name("Lease Expiry")]
        public DateTime? LeaseExpiry { get; set; }

        /// <summary>
        /// get/set - Whether the lease on the building will transfer on sale.
        /// </summary>
        [DisplayName("Transfer Lease on Sale")]
        [CsvHelper.Configuration.Attributes.Name("Transfer Lease on Sale")]
        public bool TransferLeaseOnSale { get; set; }
        #endregion
        #endregion
    }
}
