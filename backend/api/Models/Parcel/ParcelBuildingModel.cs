using System;
using System.Collections.Generic;

namespace Pims.Api.Models.Parcel
{
    public class ParcelBuildingModel : PropertyModel
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

        public float RentableArea { get; set; }

        public IEnumerable<BuildingEvaluationModel> Evaluations { get; set; } = new List<BuildingEvaluationModel>();

        public IEnumerable<BuildingFiscalModel> Fiscals { get; set; } = new List<BuildingFiscalModel>();
        #endregion
    }
}
