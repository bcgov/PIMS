using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Building class, provides an entity for the datamodel to manage buildings.
    /// </summary>
    public class Building : Property
    {
        #region Properties
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
        /// get/set - The date the building tenancy was last updated.
        /// </summary>
        public DateTime? BuildingTenancyUpdatedOn { get; set; }

        /// <summary>
        /// get/set - The building rentable area.
        /// </summary>
        public float RentableArea { get; set; }

        /// <summary>
        /// get/set - The building total area.
        /// </summary>
        public float TotalArea { get; set; }

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
        /// get/set - Metadata related to the buildings leased status.
        /// </summary>
        public string LeasedLandMetadata { get; set; }

        /// <summary>
        /// get - A collection of parcels this building is located on.
        /// </summary>
        public ICollection<ParcelBuilding> Parcels { get; } = new List<ParcelBuilding>();

        /// <summary>
        /// get - A collection of evaluations for this building.
        /// </summary>
        /// <typeparam name="BuildingEvaluation"></typeparam>
        public ICollection<BuildingEvaluation> Evaluations { get; } = new List<BuildingEvaluation>();

        /// <summary>
        /// get - A collection of fiscal values for this building.
        /// </summary>
        /// <typeparam name="BuildingFiscals"></typeparam>
        public ICollection<BuildingFiscal> Fiscals { get; } = new List<BuildingFiscal>();

        /// <summary>
        /// get - A collection of projects this building is assocated to.
        /// </summary>
        public ICollection<ProjectProperty> Projects { get; } = new List<ProjectProperty>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        public Building() { }

        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        public Building(Parcel parcel, double latitude, double longitude) : base(latitude, longitude)
        {
            if (parcel != null) {
                var pb = new ParcelBuilding(parcel, this);
                this.Parcels.Add(pb);
            }
        }
        #endregion
    }
}
