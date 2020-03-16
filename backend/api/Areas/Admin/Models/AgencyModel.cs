using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    /// <summary>
    /// AgencyModel class, provides a model that represents the agency.
    /// </summary>
    public class AgencyModel : BaseModel, IEquatable<AgencyModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identity of the agency.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name of the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique code to identify the agency.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The agency description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The parent agency.
        /// </summary>
        /// <value></value>
        public int? ParentId { get; set; }
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
                   Code == other.Code &&
                   Description == other.Description &&
                   ParentId == other.ParentId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, Name, Code, Description, ParentId);
        }
        #endregion
    }
}
