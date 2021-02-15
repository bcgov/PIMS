using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ParcelParcels class, provides the many-to-many relationship between parcels and parcels (generally for subdivisions).
    /// </summary>
    public class ParcelParcel : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key: The foreign key to the parcel.
        /// </summary>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel that the subdivision is located on.
        /// </summary>
        public virtual Parcel Parcel { get; set; }

        /// <summary>
        /// get/set - Primary key: The foreign key to the subdivision parcel.
        /// </summary>
        public int SubdivisionId { get; set; }

        /// <summary>
        /// get/set - The subdivision located on the parcel.
        /// </summary>
        public virtual Parcel Subdivision { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelParcels object.
        /// </summary>
        public ParcelParcel() { }

        /// <summary>
        /// Creates a new instance of a ParcelParcels object, initializes with specified arguments.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="building"></param>
        public ParcelParcel(Parcel parcel, Parcel subdivision)
        {
            this.ParcelId = parcel?.Id ?? throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
            this.SubdivisionId = subdivision?.Id ?? throw new ArgumentNullException(nameof(subdivision));
            this.Subdivision = subdivision;
        }
        #endregion
    }
}
