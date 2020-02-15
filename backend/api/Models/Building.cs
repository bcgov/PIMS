namespace Pims.Api.Models
{
    /// <summary>
    /// provides a class to manage building information.
    /// </summary>
    public class Building
    {
        #region Properties
        public string Description { get; set; }
        public Address Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string LocalId { get; set; }
        public string ConstructionType { get; set; }
        public string Postal { get; set; }
        public int BuldingFloorCount { get; set; }
        public string BuildingPredominateUse { get; set; }
        public string BuildingTenancy { get; set; }
        public float EstimatedValue { get; set; }
        public float AssessedValue { get; set; }
        public float NetBookValue { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        public Building() { }

        /// <summary>
        /// Create a new instance of a Building class.
        /// </summary>
        /// <param name="building"></param>
        public Building(Pims.Dal.Data.Entities.Building building)
        {
            this.Address = building.Address != null ? new Address(building.Address) : null;
            this.EstimatedValue = building.EstimatedValue;
            this.AssessedValue = building.AssessedValue;
            this.NetBookValue = building.NetBookValue;
            this.BuildingPredominateUse = building.BuildingPredominateUse?.Name;
            this.BuildingTenancy = building.BuildingTenancy;
            this.BuldingFloorCount = building.BuildingFloorCount;
            this.ConstructionType = building.BuildingConstructionType?.Name;
            this.Description = building.Description;
            this.Latitude = building.Latitude;
            this.Longitude = building.Longitude;
            building.LocalId = building.LocalId;
        }
        #endregion
    }
}
