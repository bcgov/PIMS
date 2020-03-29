using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    /// <summary>
    /// UserModel class, provides a model that represents a user.
    /// </summary>
    public class UserModel : BaseModel, IEquatable<UserModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The user's unique identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The user's display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's middlename.
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The user's surname.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - An array of agencies the user belongs to.
        /// </summary>
        public IEnumerable<AgencyModel> Agencies { get; set; } = new List<AgencyModel>();

        /// <summary>
        /// get/set - An array of roles the user is a member of.
        /// </summary>
        public IEnumerable<RoleModel> Roles { get; set; } = new List<RoleModel>();
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as UserModel);
        }

        public bool Equals([AllowNull] UserModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   DisplayName == other.DisplayName &&
                   FirstName == other.FirstName &&
                   MiddleName == other.MiddleName &&
                   LastName == other.LastName &&
                   Email == other.Email;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, DisplayName, FirstName, MiddleName, LastName, Email);
        }
        #endregion
    }
}
