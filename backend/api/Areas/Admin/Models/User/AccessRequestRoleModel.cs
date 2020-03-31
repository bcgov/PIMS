using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Admin.Models.User
{
    /// <summary>
    /// AccessRequestRoleModel class, provides a model that represents a role attached to an access request.
    /// </summary>
    public class AccessRequestRoleModel : Pims.Api.Models.CodeModel, IEquatable<AccessRequestRoleModel>
    {
        #region Properties
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as AccessRequestRoleModel);
        }

        public bool Equals([AllowNull] AccessRequestRoleModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   Name == other.Name &&
                   Description == other.Description &&
                   IsDisabled == other.IsDisabled &&
                   EqualityComparer<ICollection<UserModel>>.Default.Equals(Users, other.Users);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, Description, IsDisabled, Users);
        }
        #endregion
    }
}
