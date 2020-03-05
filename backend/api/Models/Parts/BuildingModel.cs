using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.Parts
{
    public class BuildingModel : BaseModel, IEquatable<BuildingModel>
    {
        #region Properties
        public int Id { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as BuildingModel);
        }

        public bool Equals([AllowNull] BuildingModel other)
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
