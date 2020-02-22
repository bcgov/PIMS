using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Pims.Dal.Entities
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
        public int Id { get; set; }

        /// <summary>
        /// get/set - The parcel identification number.
        /// </summary>
        public int ParcelId { get; set; }

        /// <summary>
        /// get - The friendly formated Parcel Id.
        /// </summary>
        [NotMapped]
        public string PID { get { return $"{this.ParcelId:000-000-000}"; } }

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
        /// get/set - The foreign key to the agency that owns this parcel.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency this parcel belongs to.
        /// /summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

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
        /// get/set - The land area.
        /// </summary>
        public float LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - Whether this parcel is considered sensitive and should only be visible to users who are part of the owning agency.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get/set - A collection of buildings on this parcel.
        /// </summary>
        /// <typeparam name="Building"></typeparam>
        public ICollection<Building> Buildings { get; set; } = new List<Building> ();

        /// <summary>
        /// get - A collection of evaluations for this parcel.
        /// </summary>
        /// <typeparam name="ParcelEvaluation"></typeparam>
        public ICollection<ParcelEvaluation> Evaluations { get; } = new List<ParcelEvaluation> ();

        /// <summary>
        /// get - The most recent evaluation.
        /// </summary>
        public ParcelEvaluation Evaluation { get { return this.Evaluations.OrderByDescending (e => e.FiscalYear).FirstOrDefault (); } }
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
