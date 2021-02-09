using System;
using System.Linq;
using System.Security.Claims;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ParcelModel class, provides a model that represents a parcel within PIMS.
    /// </summary>
    public class ParcelModel : PropertyModel
    {
        #region Properties
        #region Parcel Information
        /// <summary>
        /// get/set - The property identification number for Titled land.
        /// </summary>
        public int? PID { get; set; }

        /// <summary>
        /// get - The friendly formated Parcel Id.
        /// </summary>
        public string ParcelIdentity { get { return this.PID > 0 ? $"{this.PID:000-000-000}" : null; } }

        /// <summary>
        /// get/set - The property identification number of Crown Lands Registry that are not Titled.
        /// </summary>
        /// <value></value>
        public int? PIN { get; set; }

        /// <summary>
        /// get/set - The land area.
        /// </summary>
        public float? LandArea { get; set; }

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
        #endregion

        #region Financials
        /// <summary>
        /// get/set - The most recent assessment for the land.
        /// </summary>
        public decimal? AssessedLand { get; set; }

        /// <summary>
        /// get/set - When the assessment was completed.
        /// </summary>
        public DateTime? AssessedLandDate { get; set; }

        /// <summary>
        /// get/set - The most recent assessment for the buildings and improvements.
        /// </summary>
        public decimal? AssessedBuilding { get; set; }

        /// <summary>
        /// get/set - When the assessment was completed.
        /// </summary>
        public DateTime? AssessedBuildingDate { get; set; }
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelModel object.
        /// </summary>
        public ParcelModel() { }

        /// <summary>
        /// Creates a new instance of a ParcelModel object, initializes with specified parameters.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="user"></param>
        public ParcelModel(Views.Property property, ClaimsPrincipal user) : base(property, user)
        {
            this.PropertyTypeId = property.PropertyTypeId;
            this.PID = property.PID;
            this.PIN = property.PIN;
            this.LandLegalDescription = property.LandLegalDescription;
            this.LandArea = property.LandArea;

            var userAgencies = user.GetAgenciesAsNullable();

            // The property belongs to the user's agency or sub-agency, so include these properties.
            // TODO: Shuffle code around so that this can use the user.HasPermission(Permissions.AdminProperties).
            if (userAgencies.Contains(property.AgencyId) || user.HasClaim(c => c.Value == "admin-properties"))
            {
                this.Zoning = property.Zoning;
                this.ZoningPotential = property.ZoningPotential;

                this.AssessedLand = property.AssessedLand;
                this.AssessedLandDate = property.AssessedLandDate;
                this.AssessedBuilding = property.AssessedBuilding;
                this.AssessedBuildingDate = property.AssessedBuildingDate;
            }
        }
        #endregion
    }
}
