using System;

namespace BackendApi.Data.Entities
{
    /// <summary>
    /// Place class, provides an entity for the datamodel to manage places.
    /// </summary>
    public class Place
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The latitude co-ordinate.
        /// </summary>
        /// <value></value>
        public double Lat { get; set; }

        /// <summary>
        /// get/set - The longitude co-ordinate.
        /// </summary>
        /// <value></value>
        public double Lng { get; set; }

        /// <summary>
        /// get/set - The user's note for this place.
        /// </summary>
        /// <value></value>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The foreign key to the user who owns this place.
        /// </summary>
        /// <value></value>
        public Guid OwnerId { get; set; }

        /// <summary>
        /// /// get/set - When this place was created.
        /// </summary>
        /// <value></value>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get/set - When this place was updated.
        /// </summary>
        /// <value></value>
        public DateTime? UpdatedOn { get; set; }

        /// <summary>
        /// get/set - Who updated this place last.
        /// </summary>
        /// <value></value>
        public Guid? UpdatedById { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Place class.
        /// </summary>
        public Place () { }

        /// <summary>
        /// Create a new instance of a Place class.
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="note"></param>
        /// <param name="ownerId"></param>
        public Place (double lat, double lng, string note, Guid ownerId)
        {
            this.Lat = lat;
            this.Lng = lng;
            this.Note = note;
            this.OwnerId = ownerId;
            this.CreatedOn = DateTime.UtcNow;
        }
        #endregion
    }
}
