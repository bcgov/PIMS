using System;

namespace Pims.Api.Models
{
    /// <summary>
    /// Parcel class, provides a model for parcels.
    /// </summary>
    public class Parcel
    {
        #region Properties
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Parcel class.
        /// </summary>
        public Parcel() { }

        /// <summary>
        /// Creates a new instance of a Parcel class.
        /// </summary>
        /// <param name="parcel"></param>
        public Parcel(Pims.Dal.Data.Entities.Parcel parcel)
        {
            this.Id = parcel.Id;
            this.Latitude = parcel.Latitude;
            this.Longitude = parcel.Longitude;
        }

        public override bool Equals(object obj)
        {
            return obj is Parcel parcel &&
                   Id == parcel.Id &&
                   Latitude == parcel.Latitude &&
                   Longitude == parcel.Longitude;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Latitude, Longitude);
        }
        #endregion
    }
}
