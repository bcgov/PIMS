using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Keycloak.Models
{
    public class GroupModel : BaseModel, IEquatable<GroupModel>
    {
        #region Properties
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        #endregion

        #region Constructors
        public GroupModel() { }

        public GroupModel(Entity.Role role)
        {
            this.Id = role.Id;
            this.Name = role.Name;
            this.Description = role.Description;
            this.CreatedOn = role.CreatedOn;
            this.UpdatedOn = role.UpdatedOn;
            this.RowVersion = role.RowVersion == null ? null : Convert.ToBase64String(role.RowVersion);
        }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as GroupModel);
        }

        public bool Equals([AllowNull] GroupModel other)
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
