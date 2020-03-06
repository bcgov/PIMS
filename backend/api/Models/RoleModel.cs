using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class RoleModel : CodeModel, IEquatable<RoleModel>
    {
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();

        public override bool Equals(object obj)
        {
            return Equals(obj as RoleModel);
        }

        public bool Equals([AllowNull] RoleModel other)
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
    }
}
