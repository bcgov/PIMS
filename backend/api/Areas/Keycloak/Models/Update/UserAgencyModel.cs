using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Keycloak.Models.Update
{
    /// <summary>
    /// UserAgencyModel class, provides a model to represent a user agency.
    /// </summary>
    public class UserAgencyModel : IEquatable<UserAgencyModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identify for the agency.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name to identify the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
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
