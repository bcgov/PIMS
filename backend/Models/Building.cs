using System;

namespace Pims.Models
{
  /// <summary>
  /// provides a class to manage building information.
  /// </summary>
  public class Building
  {
    #region Properties
    public string Description { get; set; }
    public Pims.Models.Address Address { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string ConstructionType { get; set; }
    public string Postal {get; set;}
    public int BuldingFloorCount { get; set; }
    public string BuildingPredominateUse { get; set; }
    public string BuildingTenancy { get; set; }
    public float BuildingNetBookValue { get; set; }
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
    public Building(Pims.Api.Data.Entities.Building building)
    {
      this.Address = building.Address != null ? new Pims.Models.Address(building.Address) : null;
      this.BuildingNetBookValue = building.BuildingNetBookValue;
      this.BuildingPredominateUse = building.BuildingPredominateUse?.Name;
      this.BuildingTenancy = building.BuildingTenancy;
      this.BuldingFloorCount = building.BuildingFloorCount;
      this.ConstructionType = building.BuildingConstructionType?.Name;
      this.Description = building.Description;
      this.Latitude = building.Latitude;
      this.Longitude = building.Longitude;
    }
    #endregion
  }
}
