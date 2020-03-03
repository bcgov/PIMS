using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class UserModel : BaseModel, IEquatable<UserModel>
    {
        #region Properties
        public Guid Id { get; set; }

        public bool IsDisabled { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as UserModel);
        }

        public bool Equals([AllowNull] UserModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   IsDisabled == other.IsDisabled &&
                   DisplayName == other.DisplayName &&
                   FirstName == other.FirstName &&
                   MiddleName == other.MiddleName &&
                   LastName == other.LastName &&
                   Email == other.Email;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, IsDisabled, DisplayName, FirstName, MiddleName, LastName, Email);
        }

        #endregion
    }
}
