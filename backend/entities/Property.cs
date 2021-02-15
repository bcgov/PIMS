using NetTopologySuite.Geometries;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Property class, provides an entity for the datamodel to manage propertys.
    /// </summary>
    public abstract class Property : BaseEntity
    {
        #region Properties
        #region Identity
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The type of the property. Type is managed by business logic.
        /// </summary>
        public PropertyType PropertyType { get; set; }

        /// <summary>
        /// get/set - The id referencing the type of the property. Type is managed by business logic.
        /// </summary>
        public int PropertyTypeId { get; set; }

        /// <summary>
        /// get/set - The RAEG/SPP project numbers.
        /// </summary>
        public string ProjectNumbers { get; set; }

        /// <summary>
        /// get/set - The property name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property classification.
        /// </summary>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification for this property.
        /// </summary>
        public PropertyClassification Classification { get; set; }

        /// <summary>
        /// get/set - The encumbrance reason for this property.
        /// </summary>
        public string EncumbranceReason { get; set; }

        /// <summary>
        /// get/set - The foreign key to the agency that owns this property.
        /// </summary>
        public int? AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency this property belongs to.
        /// /summary>
        public Agency Agency { get; set; }
        #endregion

        #region Location
        /// <summary>
        /// get/set - The foreign key to the property address.
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        public Address Address { get; set; }

        /// <summary>
        /// get/set - The longitude (x), latitude (y) location of the property.
        /// </summary>
        public Point Location { get; set; }

        /// <summary>
        /// get/set - The property boundary polygon.
        /// </summary>
        public Geometry Boundary { get; set; }
        #endregion

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
            this.Location = new Point(lng, lat) { SRID = 4326 };
        }
        #endregion
    }
}
