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
        public Parcel () { }

        /// <summary>
        /// Creates a new instance of a Parcel class.
        /// </summary>
        /// <param name="parcel"></param>
        public Parcel (Pims.Api.Data.Entities.Parcel parcel)
        {
            this.Id = parcel.Id;
            this.Latitude = parcel.Latitude;
            this.Longitude = parcel.Longitude;
        }
        #endregion
    }
}
