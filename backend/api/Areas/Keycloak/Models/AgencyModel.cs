using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Keycloak.Models
{
    public class AgencyModel : BaseModel, IEquatable<AgencyModel>
    {
        #region Properties
        public int Id { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public string Description { get; set; }

        public int? ParentId { get; set; }
        #endregion

        #region Constructors
        public AgencyModel() { }

        public AgencyModel(Entity.Agency agency)
        {
            this.Id = agency.Id;
            this.Name = agency.Name;
            this.Code = agency.Code;
            this.Description = agency.Description;
            this.ParentId = agency.ParentId;
            this.CreatedOn = agency.CreatedOn;
            this.UpdatedOn = agency.UpdatedOn;
            this.RowVersion = agency.RowVersion == null ? null : Convert.ToBase64String(agency.RowVersion);
        }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as AgencyModel);
        }

        public bool Equals([AllowNull] AgencyModel other)
        {
            return other != null &&
                   Id.Equals(other.Id) &&
                   Name == other.Name &&
                   Description == other.Description &&
                   Code == other.Code &&
                   ParentId == other.ParentId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, Description, Code, ParentId);
        }
        #endregion
    }
}
