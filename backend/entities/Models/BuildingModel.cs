using System;
using System.Linq;
using System.Security.Claims;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// BuildingModel class, provides a model that represents a building within PIMS.
    /// </summary>
    public class BuildingModel : PropertyModel
    {
        #region Properties
        #region Building Information
        /// <summary>
        /// get/set - The foreign key to the property building construction type.
        /// </summary>
        public int? BuildingConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - The building construction type for this property.
        /// </summary>
        public string BuildingConstructionType { get; set; }

        /// <summary>
        /// get/set - The number of floors in the building.
        /// </summary>
        public int? BuildingFloorCount { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building predominant use.
        /// </summary>
        public int? BuildingPredominateUseId { get; set; }

        /// <summary>
        /// get/set - The building predominant use for this building.
        /// </summary>
        public string BuildingPredominateUse { get; set; }

        /// <summary>
        /// get/set - The type of tenancy for this building.
        /// </summary>
        public string BuildingTenancy { get; set; }

        /// <summary>
        /// get/set - The building rentable area.
        /// </summary>
        public float? RentableArea { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building occupant type.
        /// </summary>
        public int? BuildingOccupantTypeId { get; set; }

        /// <summary>
        /// get/set - The type of occupant for this building.
        /// </summary>
        public string BuildingOccupantType { get; set; }

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
        public bool? TransferLeaseOnSale { get; set; }
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The most recent assessment for the buildings and improvements.
        /// </summary>
        public decimal? Assessed { get; set; }

        /// <summary>
        /// get/set - When the assessment was completed.
        /// </summary>
        public DateTime? AssessedDate { get; set; }
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingModel object.
        /// </summary>
        public BuildingModel() { }

        /// <summary>
        /// Creates a new instance of a BuildingModel object, initializes with specified parameters.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="user"></param>
        public BuildingModel(Views.Property property, ClaimsPrincipal user) : base(property, user)
        {
            this.PropertyTypeId = PropertyTypes.Building;
            this.BuildingConstructionTypeId = property.BuildingConstructionTypeId;
            this.BuildingConstructionType = property.BuildingConstructionType;
            this.BuildingOccupantTypeId = property.BuildingOccupantTypeId;
            this.BuildingOccupantType = property.BuildingOccupantType;
            this.BuildingPredominateUseId = property.BuildingPredominateUseId;
            this.BuildingPredominateUse = property.BuildingPredominateUse;
            this.BuildingFloorCount = property.BuildingFloorCount;
            this.BuildingTenancy = property.BuildingTenancy;
            this.RentableArea = property.RentableArea;

            var userAgencies = user.GetAgenciesAsNullable();

            // The property belongs to the user's agency or sub-agency, so include these properties.
            // TODO: Shuffle code around so that this can use the user.HasPermission(Permissions.AdminProperties).
            if (userAgencies.Contains(property.AgencyId) || user.HasClaim(c => c.Value == "admin-properties"))
            {
                this.LeaseExpiry = property.LeaseExpiry;
                this.OccupantName = property.OccupantName;
                this.TransferLeaseOnSale = property.TransferLeaseOnSale;
                this.Assessed = property.AssessedBuilding;
                this.AssessedDate = property.AssessedBuildingDate;
            }
        }
        #endregion
    }
}
