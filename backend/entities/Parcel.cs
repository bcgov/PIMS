using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Parcel class, provides an entity for the datamodel to manage parcels.
    /// </summary>
    public class Parcel : Property
    {
        #region Properties
        /// <summary>
        /// get/set - The property identification number for Titled land.
        /// </summary>
        public int PID { get; set; }

        /// <summary>
        /// get - The friendly formated Parcel Id.
        /// </summary>
        [NotMapped]
        public string ParcelIdentity { get { return this.PID > 0 ? $"{this.PID:000-000-000}" : null; } }

        /// <summary>
        /// get/set - The property identification number of Crown Lands Registry that are not Titled.
        /// </summary>
        /// <value></value>
        public int? PIN { get; set; }

        /// <summary>
        /// get/set - The land area.
        /// </summary>
        public float LandArea { get; set; }

        /// <summary>
        /// get/set - The land legal description.
        /// </summary>
        public string LandLegalDescription { get; set; }

        /// <summary>
        /// get/set - Current Parcel zoning information
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - Potential future Parcel zoning information
        /// </summary>
        public string ZoningPotential { get; set; }

        /// <summary>
        /// get/set - Provides a way to identify parcels that are not owned by the agency.
        /// </summary>
        public bool NotOwned { get; set; }

        /// <summary>
        /// get/set - A collection of buildings on this parcel.
        /// </summary>
        /// <typeparam name="Building"></typeparam>
        public ICollection<ParcelBuilding> Buildings { get; } = new List<ParcelBuilding>();

        /// <summary>
        /// get - A collection of evaluations for this parcel.
        /// </summary>
        /// <typeparam name="ParcelEvaluation"></typeparam>
        public ICollection<ParcelEvaluation> Evaluations { get; } = new List<ParcelEvaluation>();

        /// <summary>
        /// get - A collection of fiscal values for this parcel.
        /// </summary>
        /// <typeparam name="ParcelFiscals"></typeparam>
        public ICollection<ParcelFiscal> Fiscals { get; } = new List<ParcelFiscal>();

        /// <summary>
        /// get - A collection of projects this parcel is assocated to.
        /// </summary>
        public ICollection<ProjectProperty> Projects { get; } = new List<ProjectProperty>();

        /// <summary>
        /// get/set - A collection of parcels associated to this subdivision (empty if this parcel is not a subdivision).
        /// </summary>
        /// <typeparam name="ParcelParcels"></typeparam>
        public ICollection<ParcelParcel> Parcels { get; } = new List<ParcelParcel>();

        /// <summary>
        /// get/set - A collection of subdivisions associated to this parcel (empty if this parcel is not subdivided).
        /// </summary>
        /// <typeparam name="ParcelParcels"></typeparam>
        public ICollection<ParcelParcel> Subdivisions { get; } = new List<ParcelParcel>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Parcel class.
        /// </summary>
        public Parcel() { }

        /// <summary>
        /// Create a new instance of a Parcel class.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        public Parcel(int pid, double latitude, double longitude) : base(latitude, longitude)
        {
            this.PID = pid;
        }
        #endregion
    }
}
