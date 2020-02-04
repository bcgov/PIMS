using System;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// Building class, provides an entity for the datamodel to manage buildings.
    /// </summary>
    public class Building : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to the parcel.
        /// </summary>
        /// <value></value>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel this building belongs to.
        /// </summary>
        /// <value></value>
        public Parcel Parcel { get; set; }

        /// <summary>
        /// get/set - The local identification number.
        /// </summary>
        /// <value></value>
        public int LocalId { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property address.
        /// </summary>
        /// <value></value>
        public int AddressId { get; set; }

        /// <summary>
        /// get/set - The address for this property.
        /// </summary>
        /// <value></value>
        public Address Address { get; set; }

        /// <summary>
        /// get/set - The Latitude co-ordinate.
        /// </summary>
        /// <value></value>
        public double Latitude { get; set; }

        /// <summary>
        /// get/set - The longitude co-ordinate.
        /// </summary>
        /// <value></value>
        public double Longitude { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property building construction type.
        /// </summary>
        /// <value></value>
        public int BuildingConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - The building construction type for this property.
        /// </summary>
        /// <value></value>
        public BuildingConstructionType BuildingConstructionType { get; set; }

        /// <summary>
        /// get/set - The number of floors in the building.
        /// </summary>
        /// <value></value>
        public int BuildingFloorCount { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property building predominant use.
        /// </summary>
        /// <value></value>
        public int BuildingPredominateUseId { get; set; }

        /// <summary>
        /// get/set - The building predominant use for this property.
        /// </summary>
        /// <value></value>
        public BuildingPredominateUse BuildingPredominateUse { get; set; }

        /// <summary>
        /// get/set - The type of tenancy for this building.
        /// </summary>
        /// <value></value>
        public string BuildingTenancy { get; set; }

        /// <summary>
        /// get/set - The net-book value for this building.
        /// /// </summary>
        /// <value></value>
        public float BuildingNetBookValue { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        public Building () { }

        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        public Building (double lat, double lng)
        {
            this.Latitude = lat;
            this.Longitude = lng;
        }
        #endregion
    }
}
