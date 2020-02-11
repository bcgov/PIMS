using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Models;

namespace Pims.Api.Models
{
  /// <summary>
  /// Parcel class, provides a model for parcel details.
  /// </summary>
  public class ParcelDetail
  {
    #region Properties

    public string Agency { get; set; }
    public int Id { get; set; }
    public string PID { get; set; }
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
      this.Description = parcelDetail.Description; 
      this.Buildings = parcelDetail.Buildings
        .Where(buildingEntity => buildingEntity != null)
        .Select(buildingEntity => new Pims.Models.Building(buildingEntity))
        .ToArray();
      this.Id = parcelDetail.Id;
      this.Latitude = parcelDetail.Latitude;
      this.Longitude = parcelDetail.Longitude;
      this.LandArea = parcelDetail.LandArea;
      this.LandLegalDescription = parcelDetail.LandLegalDescription;
      this.Longitude = parcelDetail.Longitude;
      this.PID = parcelDetail.PID;
      this.PropertyClassification = parcelDetail.Classification?.Name;
      this.PropertyStatus = parcelDetail.Status?.Name;
      this.Agency = parcelDetail.Agency?.Name;
    }

        public override bool Equals(object obj)
        {
            return obj is ParcelDetail detail &&
                   Agency == detail.Agency &&
                   Id == detail.Id &&
                   PID == detail.PID &&
                   Latitude == detail.Latitude &&
                   Longitude == detail.Longitude &&
                   PropertyStatus == detail.PropertyStatus &&
                   PropertyClassification == detail.PropertyClassification &&
                   Description == detail.Description &&
                   AssessedValue == detail.AssessedValue &&
                   EqualityComparer<Address>.Default.Equals(Address, detail.Address) &&
                   LandArea == detail.LandArea &&
                   LandLegalDescription == detail.LandLegalDescription &&
                   EqualityComparer<ICollection<Building>>.Default.Equals(Buildings, detail.Buildings);
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(Agency);
            hash.Add(Id);
            hash.Add(PID);
            hash.Add(Latitude);
            hash.Add(Longitude);
            hash.Add(PropertyStatus);
            hash.Add(PropertyClassification);
            hash.Add(Description);
            hash.Add(AssessedValue);
            hash.Add(Address);
            hash.Add(LandArea);
            hash.Add(LandLegalDescription);
            hash.Add(Buildings);
            return hash.ToHashCode();
        }
        #endregion
    }
}
