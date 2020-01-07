using System;

namespace BackendApi.Models
{
    /// <summary>
    /// Place class, provides a model for places.
    /// /// </summary>
    public class Place
    {
        #region Properties
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Note { get; set; }
        public Guid OwnerId { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Place class.
        /// </summary>
        public Place () { }

        /// <summary>
        /// Creates a new instance of a Place class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="note"></param>
        /// <param name="ownerId"></param>
        public Place (int id, double lat, double lng, string note, Guid ownerId)
        {
            this.Id = id;
            this.Latitude = lat;
            this.Longitude = lng;
            this.Note = note;
            this.OwnerId = ownerId;
        }

        /// <summary>
        /// Creates a new instance of a Place class.
        /// /// </summary>
        /// <param name="place"></param>
        public Place (BackendApi.Data.Entities.Place place)
        {
            this.Id = place.Id;
            this.Latitude = place.Lat;
            this.Longitude = place.Lng;
            this.Note = place.Note;
            this.OwnerId = place.OwnerId;
        }
        #endregion
    }
}
