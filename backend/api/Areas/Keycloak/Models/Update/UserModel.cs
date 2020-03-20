using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Update
{
    /// <summary>
    /// UserModel class, provides a model that represents a user.
    /// </summary>
    public class UserModel : BaseModel, IEquatable<UserModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The display name of the user.
        /// </summary>
        /// <value></value>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's middle name.
        /// </summary>
        /// <value></value>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The user's last name.
        /// </summary>
        /// <value></value>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        /// <value></value>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - An array of agencies the user belongs to.
        /// </summary>
        /// <typeparam name="UserAgencyModel"></typeparam>
        /// <returns></returns>
        public IEnumerable<UserAgencyModel> Agencies { get; set; } = new List<UserAgencyModel>();

        /// <summary>
        /// get/set - An array of roles the user is a member of.
        /// </summary>
        /// <typeparam name="UserRoleModel"></typeparam>
        /// <returns></returns>
        public IEnumerable<UserRoleModel> Roles { get; set; } = new List<UserRoleModel>();
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as UserModel);
        }

        public bool Equals([AllowNull] UserModel other)
        {
            return other != null &&
                   DisplayName == other.DisplayName &&
                   FirstName == other.FirstName &&
                   MiddleName == other.MiddleName &&
                   LastName == other.LastName &&
                   Email == other.Email;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(DisplayName, FirstName, MiddleName, LastName, Email);
        }
        #endregion
    }
}
