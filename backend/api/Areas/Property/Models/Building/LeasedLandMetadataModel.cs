namespace Pims.Api.Areas.Property.Models.Building
{
    /// <summary>
    /// LeasedLandMetadataModel class, provides a model to represent leased land so that a building can include this information.
    /// </summary>
    public class LeasedLandMetadataModel
    {
        #region Properties
        /// <summary>
        /// get/set - Note related to the ownership of the land associated to this building.
        /// </summary>
        public string OwnershipNote { get; set; }

        /// <summary>
        /// get/set - An id used to associate this metadata with a parcel.
        /// </summary>
        public int ParcelId { get; set; }

        /// <summary>
        /// get/set - the lease type
        /// </summary>
        public int Type { get; set; }
        #endregion
    }
}
