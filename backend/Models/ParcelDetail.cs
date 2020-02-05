using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Models
{
  /// <summary>
  /// Parcel class, provides a model for parcel details.
  /// </summary>
  public class ParcelDetail
  {
    #region Properties
    public int Id { get; set; }
    public string PID { get; set; }
    public int LocalId { get; set; }
    public string LID { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string PropertyStatus { get; set; }
    public string PropertyClassification { get; set; }
    public string Description { get; set; }
    public float AssessedValue { get; set; }
    public Pims.Models.Address Address { get; set; }
    public float LandArea { get; set; }
    public string LandLegalDescription { get; set; }
    public ICollection<Pims.Models.Building> Buildings { get; set; }

    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a ParcelDetail class.
    /// </summary>
    public ParcelDetail() { }

    /// <summary>
    /// Creates a new instance of a ParcelDetail class.
    /// </summary>
    /// <param name="parcelDetail"></param>
    public ParcelDetail(Pims.Api.Data.Entities.Parcel parcelDetail)
    {
      this.Address = parcelDetail.Address != null ? new Pims.Models.Address(parcelDetail.Address) : null;
      this.AssessedValue = parcelDetail.AssessedValue;
      this.Buildings = parcelDetail.Buildings
        .Where(buildingEntity => buildingEntity != null)
        .Select(buildingEntity => new Pims.Models.Building(buildingEntity))
        .ToArray();
      this.Id = parcelDetail.Id;
      this.Latitude = parcelDetail.Latitude;
      this.Longitude = parcelDetail.Longitude;
      this.LandArea = parcelDetail.LandArea;
      this.LandLegalDescription = parcelDetail.LandLegalDescription;
      this.LID = parcelDetail.LID;
      this.LocalId = parcelDetail.LocalId;
      this.Longitude = parcelDetail.Longitude;
      this.PID = parcelDetail.PID;
      this.PropertyClassification = parcelDetail.Classification?.Name;
      this.PropertyStatus = parcelDetail.Status?.Name;
    }
    #endregion
  }
}
