using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// Parcel class, provides an entity for the datamodel to manage parcels.
    /// </summary>
    public class Parcel : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The parcel identification number.
        /// </summary>
        /// <value></value>
        public int ParcelId { get; set; }

        /// <summary>
        /// get - The friendly formated Parcel Id.
        /// </summary>
        /// <value></value>
        [NotMapped]
        public string PID { get { return $"{this.ParcelId:000-000-000}"; } }

        /// <summary>
        /// get/set - The local identification number.
        /// </summary>
        /// <value></value>
        public int LocalId { get; set; }

        /// <summary>
        /// get - The friendly formated Local Id.
        /// </summary>
        /// <value></value>
        [NotMapped]
        public string LID { get { return $"{this.LocalId:000-000}"; } }

        /// <summary>
        /// get/set - The foreign key to the property status.
        /// </summary>
        /// <value></value>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The status for this property.
        /// </summary>
        /// <value></value>
        public PropertyStatus Status { get; set; }

        /// <summary>
        /// get/set - The foreign key to the property classification.
        /// </summary>
        /// <value></value>
        public int ClassificationId { get; set; }

        /// <summary>
        /// get/set - The classification for this property.
        /// </summary>
        /// <value></value>
        public PropertyClassification Classification { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The assessed value of the property.
        /// </summary>
        /// <value></value>
        public float AssessedValue { get; set; }

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
        /// get/set - The land area.
        /// </summary>
        /// <value></value>
        public float LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description.
        /// </summary>
        /// <value></value>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - A collection of buildings on this parcel.
        /// </summary>
        /// <typeparam name="Building"></typeparam>
        /// <returns></returns>
        public ICollection<Building> Buildings { get; set; } = new List<Building> ();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Parcel class.
        /// </summary>
        public Parcel () { }

        /// <summary>
        /// Create a new instance of a Parcel class.
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        public Parcel (double lat, double lng)
        {
            this.Latitude = lat;
            this.Longitude = lng;
        }
        #endregion
    }
}
