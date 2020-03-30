using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class UserModel : BaseModel, IEquatable<UserModel>
    {
        #region Properties
        public Guid Id { get; set; }

        public bool IsDisabled { get; set; }

        public string Username { get; set; }

        public string Position { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Note { get; set; }

        public IEnumerable<AgencyModel> Agencies { get; set; }

        public IEnumerable<RoleModel> Roles { get; set; }
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
                   IsDisabled == other.IsDisabled &&
                   Username == other.Username &&
                   DisplayName == other.DisplayName &&
                   FirstName == other.FirstName &&
                   MiddleName == other.MiddleName &&
                   LastName == other.LastName &&
                   Position == other.Position &&
                   Note == other.Note &&
                   Email == other.Email;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(Id);
            hash.Add(IsDisabled);
            hash.Add(Username);
            hash.Add(DisplayName);
            hash.Add(FirstName);
            hash.Add(MiddleName);
            hash.Add(LastName);
            hash.Add(Email);
            hash.Add(Position);
            hash.Add(Note);
            return hash.ToHashCode();
        }

        #endregion
    }
}
