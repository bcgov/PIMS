using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Update
{
    /// <summary>
    /// UserRoleModel class, provides a model that represents a user role model.
    /// </summary>
    public class UserRoleModel : IEquatable<UserRoleModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identify for the user role.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name that identifies the user role.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as UserRoleModel);
        }

        public bool Equals([AllowNull] UserRoleModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   Name == other.Name;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name);
        }
        #endregion
    }
}
