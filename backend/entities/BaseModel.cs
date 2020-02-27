using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Models
{
    public abstract class BaseModel : IEquatable<BaseModel>
    {
        #region Properties
        public DateTime CreatedOn { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string RowVersion { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as BaseModel);
        }

        public bool Equals([AllowNull] BaseModel other)
        {
            return other != null &&
                   CreatedOn == other.CreatedOn &&
                   UpdatedOn == other.UpdatedOn &&
                   RowVersion == other.RowVersion;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(CreatedOn, UpdatedOn, RowVersion);
        }
        #endregion
    }
}
