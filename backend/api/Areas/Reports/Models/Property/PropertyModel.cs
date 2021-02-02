using Pims.Dal.Entities;
using System;
using System.ComponentModel;

namespace Pims.Api.Areas.Reports.Models.Property
{
    public class PropertyModel
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
        /// get/set - The parent agency acronym.
        /// </summary>
        public string Ministry { get; set; }

        /// <summary>
        /// get/set - The owning agency full name.
        /// </summary>
        public string Agency { get; set; }

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
        /// get/set - The most recent assessed land value.
        /// </summary>
        [DisplayName("Assessed Land Value")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Land Value")]
        public decimal? AssessedLand { get; set; }

        /// <summary>
        /// get/set - The most recent assessed building value.
        /// </summary>
        [DisplayName("Assessed Building Value")]
        [CsvHelper.Configuration.Attributes.Name("Assessed Building Value")]
        public decimal? AssessedBuilding { get; set; }

        /// <summary>
        /// get/set - The most recent market value.
        /// </summary>
        [DisplayName("Market Value")]
        [CsvHelper.Configuration.Attributes.Name("Market Value")]
        public decimal Market { get; set; }

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
        #endregion

        #region Building Properties
        /// <summary>
        /// get/set - The building construction type.
        /// </summary>
        [DisplayName("Construction Type")]
        [CsvHelper.Configuration.Attributes.Name("Construction Type")]
        public string BuildingConstructionType { get; set; }

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
