using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Keycloak.Models
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

        public bool IsDisabled { get; set; }

        public IEnumerable<AgencyModel> Agencies { get; set; } = new List<AgencyModel>();

        public IEnumerable<GroupModel> Groups { get; set; } = new List<GroupModel>();
        #endregion

        #region Constructors
        public UserModel() { }

        public UserModel(Entity.User user)
        {
            this.Id = user.Id;
            this.DisplayName = user.DisplayName;
            this.FirstName = user.FirstName;
            this.MiddleName = user.MiddleName;
            this.LastName = user.LastName;
            this.Email = user.Email;
            this.IsDisabled = user.IsDisabled;
            this.Agencies = user.Agencies.Select(a => new AgencyModel(a.Agency));
            this.Groups = user.Roles.Select(r => new GroupModel(r.Role));
            this.CreatedOn = user.CreatedOn;
            this.UpdatedOn = user.UpdatedOn;
            this.RowVersion = user.RowVersion == null ? null : Convert.ToBase64String(user.RowVersion);
        }
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
