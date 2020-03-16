using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Update
{
    public abstract class BaseModel : IEquatable<BaseModel>
    {
        #region Properties
        public string RowVersion { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as BaseModel);
        }

        public bool Equals([AllowNull] BaseModel other)
        {
            return other != null &&
                   RowVersion == other.RowVersion;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(RowVersion);
        }
        #endregion
    }
}
