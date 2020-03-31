using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.Property
{

    public class PropertyModel : IEquatable<PropertyModel>
    {
        #region Properties
        public int Id { get; set; }

        public int PropertyTypeId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Description { get; set; }

        #region Land Properties

        public string PID { get; set; }

        public string PIN { get; set; }

        public int StatusId { get; set; }

        public int ClassificationId { get; set; }
        #endregion

        #region Building Properties
        #endregion
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as PropertyModel);
        }

        public bool Equals([AllowNull] PropertyModel other)
        {
            return other != null &&
                Id == other.Id &&
                PropertyTypeId == other.PropertyTypeId &&
                Latitude == other.Latitude &&
                Longitude == other.Longitude &&
                Description == other.Description &&
                PID == other.PID &&
                PIN == other.PIN &&
                StatusId == other.StatusId &&
                ClassificationId == other.ClassificationId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, PID, PIN, StatusId, ClassificationId, Latitude, Longitude, Description);
        }
        #endregion
    }
}
