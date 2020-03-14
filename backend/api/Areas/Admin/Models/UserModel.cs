using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    public class UserModel : BaseModel, IEquatable<UserModel>
    {
        #region Properties
        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public IEnumerable<AgencyModel> Agencies { get; set; }

        public IEnumerable<RoleModel> Roles { get; set; }

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
