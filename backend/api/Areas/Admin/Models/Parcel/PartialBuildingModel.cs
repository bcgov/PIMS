using System;
using System.Diagnostics.CodeAnalysis;
using Model = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parcel
{
    public class PartialBuildingModel : Model.BaseModel, IEquatable<PartialBuildingModel>
    {
        #region Properties
        public int Id { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as PartialBuildingModel);
        }

        public bool Equals([AllowNull] PartialBuildingModel other)
        {
            return other != null &&
                   Id == other.Id &&
                   LocalId == other.LocalId &&
                   Description == other.Description &&
                   Latitude == other.Latitude &&
                   Longitude == other.Longitude;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, LocalId, Description, Latitude, Longitude);
        }
        #endregion
    }
}
