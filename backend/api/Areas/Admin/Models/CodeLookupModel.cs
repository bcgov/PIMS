using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    /// <summary>
    /// LookupCodeModel class, provides a model that represents look up objects.
    /// </summary>
    public class LookupCodeModel : BaseModel, IEquatable<LookupCodeModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The unique name of the lookup item.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique code to identify the item.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The description of the item.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion

        #region Methods
        public override bool Equals(object obj)
        {
            return Equals(obj as LookupCodeModel);
        }

        public bool Equals([AllowNull] LookupCodeModel other)
        {
            return other != null &&
                   Name == other.Name &&
                   Code == other.Code &&
                   Description == other.Description;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Code, Description);
        }
        #endregion
    }
}
