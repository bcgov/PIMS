using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Role
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : Pims.Api.Models.BaseModel, IEquatable<RoleModel>
    {
        #region Properties
        /// <summary>
        /// get/set - A unique identify for the role.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the role.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The role description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as RoleModel);
        }

        public bool Equals([AllowNull] RoleModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   Name == other.Name &&
                   Description == other.Description;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, Description);
        }
        #endregion
    }
}
