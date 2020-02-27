using System;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    public class LookupCodeModel : BaseModel, IEquatable<LookupCodeModel>
    {
        #region Properties
        public string Name { get; set; }

        public string Code { get; set; }

        public string Description { get; set; }

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
