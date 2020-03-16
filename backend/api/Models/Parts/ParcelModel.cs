using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.Parts
{
    public class ParcelModel : BaseModel, IEquatable<ParcelModel>
    {
        #region Properties
        public int Id { get; set; }

        public string PID { get; set; }

        public string PIN { get; set; }

        public int StatusId { get; set; }

        public int ClassificationId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as ParcelModel);
        }

        public bool Equals([AllowNull] ParcelModel other)
        {
            return other != null &&
                Id == other.Id &&
                PID == other.PID &&
                PIN == other.PIN &&
                StatusId == other.StatusId &&
                ClassificationId == other.ClassificationId &&
                Latitude == other.Latitude &&
                Longitude == other.Longitude &&
                Description == other.Description;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, PID, PIN, StatusId, ClassificationId, Latitude, Longitude, Description);
        }
        #endregion
    }
}
