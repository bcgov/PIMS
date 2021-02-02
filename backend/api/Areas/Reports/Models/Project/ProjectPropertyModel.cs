using Pims.Api.Models;

namespace Pims.Api.Areas.Reports.Models.Project
{
    public class ProjectPropertyModel : BaseModel
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
        /// get/set - property name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The classification of the property.
        /// </summary>
        public string Classification { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The owning agency name.
        /// </summary>
        public string Agency { get; set; }

        /// <summary>
        /// get/set - The owning sub agency name.
        /// </summary>
        public string SubAgency { get; set; }

        /// <summary>
        /// get/set - The owning agency code.
        /// </summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The address of the property.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The name of the administrative area (city, municipality, district, etc.).
        /// </summary>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The property netbook value.
        /// </summary>
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The property assessed value.
        /// </summary>
        public decimal? Assessed { get; set; }

        /// <summary>
        /// get/set - The property market value.
        /// </summary>
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The land area of the parcel.
        /// </summary>
        public float LandArea { get; set; }


        /// <summary>
        /// get/set - The id of the parcel.
        /// </summary>
        public float ParcelId { get; set; }

        /// <summary>
        /// get/set - The property zoning
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - The property zoning potential
        /// </summary>
        public string ZoningPotential { get; set; }
        #endregion
    }
}
