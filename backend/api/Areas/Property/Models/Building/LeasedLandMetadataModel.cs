using Pims.Api.Areas.Property.Models.Parcel;
using Pims.Api.Models;
using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Property.Models.Building
{
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
        public string ParcelId { get; set; }

        /// <summary>
        /// get/set - the lease type
        /// </summary>
        public int Type { get; set; }
        #endregion
    }
}
