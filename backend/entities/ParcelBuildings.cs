using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ParcelBuilding class, provides the many-to-many relationship between parcels and buildings.
    /// </summary>
    public class ParcelBuilding : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key: The foreign key to the parcel.
        /// </summary>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel that the building is located on.
        /// </summary>
        public Parcel Parcel { get; set; }

        /// <summary>
        /// get/set - Primary key: The foreign key to the building.
        /// </summary>
        public int BuildingId { get; set; }

        /// <summary>
        /// get/set - The building located on the parcel.
        /// </summary>
        public Building Building { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelBuilding object.
        /// </summary>
        public ParcelBuilding() { }

        /// <summary>
        /// Creates a new instance of a ParcelBuilding object, initializes with specified arguments.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="building"></param>
        public ParcelBuilding(Parcel parcel, Building building)
        {
            this.ParcelId = parcel?.Id ?? throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
            this.BuildingId = building?.Id ?? throw new ArgumentNullException(nameof(building));
            this.Building = building;
        }
        #endregion
    }
}
