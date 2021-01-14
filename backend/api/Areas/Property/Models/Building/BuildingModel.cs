using Pims.Api.Areas.Property.Models.Parcel;
using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Property.Models.Building
{
    public class BuildingModel : PropertyModel
    {
        #region Properties
        public int ParcelId { get; set; }

        public int BuildingConstructionTypeId { get; set; }

        public string BuildingConstructionType { get; set; }

        public int BuildingFloorCount { get; set; }

        public int BuildingPredominateUseId { get; set; }

        public string BuildingPredominateUse { get; set; }

        public int BuildingOccupantTypeId { get; set; }

        public string BuildingOccupantType { get; set; }

        public DateTime? LeaseExpiry { get; set; }

        public string OccupantName { get; set; }

        public bool TransferLeaseOnSale { get; set; }

        public string BuildingTenancy { get; set; }

        public DateTime? BuildingTenancyUpdatedOn { get; set; }

        public float RentableArea { get; set; }

        public float TotalArea { get; set; }

        public IEnumerable<LeasedLandMetadataModel> LeasedLandMetadata { get; set; } = new List<LeasedLandMetadataModel>();

        public IEnumerable<BuildingParcelModel> Parcels { get; set; } = new List<BuildingParcelModel>();

        public IEnumerable<BuildingEvaluationModel> Evaluations { get; set; } = new List<BuildingEvaluationModel>();

        public IEnumerable<BuildingFiscalModel> Fiscals { get; set; } = new List<BuildingFiscalModel>();
        #endregion
    }
}
