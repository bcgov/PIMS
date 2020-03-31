using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models.User
{
    public class AgencyModel : CodeModel, IEquatable<AgencyModel>
    {
        #region Properties
        public string Description { get; set; }
        public AgencyModel Parent { get; set; }
        public ICollection<AgencyModel> Children { get; } = new List<AgencyModel>();
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as AgencyModel);
        }

        public bool Equals([AllowNull] AgencyModel other)
        {
            return other != null &&
                   base.Equals(other) &&
                   Description == other.Description;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(base.GetHashCode(), Description, Parent, Children, Users);
        }
        #endregion
    }
}
