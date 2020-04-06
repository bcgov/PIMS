using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Entities
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
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to the parcel.  This is not the PID value.
        /// </summary>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel this building belongs to.
        /// </summary>
        public Parcel Parcel { get; set; }

        /// <summary>
        /// get/set - The local identification number.
        /// </summary>
        public string LocalId { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        /// <value></value>
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
        /// get/set - The foreign key to the property building construction type.
        /// </summary>
        public int BuildingConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - The building construction type for this property.
        /// </summary>
        public BuildingConstructionType BuildingConstructionType { get; set; }

        /// <summary>
        /// get/set - The number of floors in the building.
        /// </summary>
        public int BuildingFloorCount { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building predominant use.
        /// </summary>
        public int BuildingPredominateUseId { get; set; }

        /// <summary>
        /// get/set - The building predominant use for this building.
        /// </summary>
        public BuildingPredominateUse BuildingPredominateUse { get; set; }

        /// <summary>
        /// get/set - The type of tenancy for this building.
        /// </summary>
        public string BuildingTenancy { get; set; }

        /// <summary>
        /// get/set - The building rentable area.
        /// </summary>
        public float RentableArea { get; set; }

        /// <summary>
        /// get/set - The foreign key to the agency that owns this building.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency this building belongs to.
        /// </summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building occupant type.
        /// </summary>
        public int BuildingOccupantTypeId { get; set; }

        /// <summary>
        /// get/set - The type of occupant for this building.
        /// </summary>
        public BuildingOccupantType BuildingOccupantType { get; set; }

        /// <summary>
        /// get/set - The expiry date of the currently active lease
        /// </summary>
        public DateTime? LeaseExpiry { get; set; }

        /// <summary>
        /// get/set - The name of the occupant/organization
        /// </summary>
        public string OccupantName { get; set; }

        /// <summary>
        /// get/set - Whether the lease on this building would be transferred if the building is sold.
        /// </summary>
        public bool TransferLeaseOnSale { get; set; } = false;

        /// <summary>
        /// get/set - Whether this building is considered sensitive and should only be visible to users who are part of the owning agency.
        /// </summary>
        public bool IsSensitive { get; set; }

        /// <summary>
        /// get - A collection of evaluations for this building.
        /// </summary>
        /// <typeparam name="BuildingEvaluation"></typeparam>
        public ICollection<BuildingEvaluation> Evaluations { get; } = new List<BuildingEvaluation> ();

        /// <summary>
        /// get - The most recent evaluation.
        /// </summary>
        public BuildingEvaluation Evaluation { get { return this.Evaluations.OrderByDescending (e => e.FiscalYear).FirstOrDefault (); } }
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
