using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Role.Update
{
    /// <summary>
    /// BaseModel class, provides a model that represents the base properties of an update model.
    /// </summary>
    public abstract class BaseModel : IEquatable<BaseModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The rowversion of the item.
        /// </summary>
        /// <value></value>
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
