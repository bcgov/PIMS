using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Keycloak.Models.Update
{
    public class UserAgencyModel : IEquatable<UserAgencyModel>
    {
        #region Properties
        public int Id { get; set; }

        public string Name { get; set; }

        public UpdateActions Action { get; set; } = UpdateActions.NoAction;
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as UserAgencyModel);
        }

        public bool Equals([AllowNull] UserAgencyModel other)
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
