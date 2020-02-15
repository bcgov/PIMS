namespace Pims.Api.Areas.Admin.Models.Parts
{
    public class ParcelBuildingModel
    {
        #region Properties
        public int Id { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public AddressModel Address { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int BuildingConstructionTypeId { get; set; }

        public string BuildingConstructionType { get; set; }

        public int BuildingFloorCount { get; set; }

        public int BuildingPredominateUseId { get; set; }

        public string BuildingPredominateUse { get; set; }

        public string BuildingTenancy { get; set; }

        public float RentableArea { get; set; }

        public float EstimatedValue { get; set; }

        public float AssessedValue { get; set; }

        public float NetBookValue { get; set; }
        #endregion
    }
}
