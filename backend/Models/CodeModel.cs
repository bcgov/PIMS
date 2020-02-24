using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class CodeModel : IEquatable<CodeModel>
    {
        #region Properties
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsDisabled { get; set; }

        public string Type { get; set; }

        public override bool Equals(object obj)
        {
            return Equals(obj as CodeModel);
        }

        public bool Equals([AllowNull] CodeModel other)
        {
            return other != null &&
                   Name == other.Name &&
                   Id == other.Id &&
                   IsDisabled == other.IsDisabled &&
                   Type == other.Type;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Name, Id, IsDisabled);
        }
        #endregion
    }
}
