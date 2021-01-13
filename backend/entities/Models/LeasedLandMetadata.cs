using System;

namespace Pims.Dal.Entities.Models
{
    public class LeasedLandMetadata
    {
        #region Properties
        /// <summary>
        /// get/set - Whether an exemption was requested for the ERP.
        /// </summary>
        public string OwnershipNote { get; set; }
        /// <summary>
        /// get/set - An id used to associate this metadata with a parcel.
        /// </summary>
        public string ParcelId { get; set; }
        /// <summary>
        /// get/set - the lease type
        /// </summary>
        public int Type { get; set; }
        #endregion
    }
}
