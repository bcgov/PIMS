using System.ComponentModel.DataAnnotations.Schema;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Property class, provides an entity for the datamodel to manage propertys.
    /// </summary>
    public abstract class Property : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The RAEG/SPP project number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The property name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status for this property.
        /// </summary>
        public PropertyStatus Status { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property classification.
        /// </summary>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification for this property.
        /// </summary>
        public PropertyClassification Classification { get; set; }

        /// <summary>
        /// get/set - The foreign key to the agency that owns this property.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency this property belongs to.
        /// /summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property address.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public Address Address { get; set; }

        /// <summary>
        /// get/set - The Latitude co-ordinate.
        /// </summary>
        public double Latitude { get; set; }

        /// <summary>
        /// get/set - The longitude co-ordinate.
        /// </summary>
        public double Longitude { get; set; }

        /// <summary>
        /// get/set - Whether this property is considered sensitive and should only be visible to users who are part of the owning agency.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - Whether the property is visible to other agencies.  This is used to make properties visible during ERP, but can be used at other times too.
        /// </summary>
        public bool IsVisibleToOtherAgencies { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Property class.
        /// </summary>
        public Property() { }

        /// <summary>
        /// Create a new instance of a Property class.
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        public Property(double lat, double lng)
        {
            this.Latitude = lat;
            this.Longitude = lng;
        }
        #endregion
    }
}
