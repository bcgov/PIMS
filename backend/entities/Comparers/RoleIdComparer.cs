using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class RoleIdComparer : IEqualityComparer<Role>
    {
        public bool Equals([AllowNull] Role x, [AllowNull] Role y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] Role obj)
        {
            var hash = new HashCode();
            hash.Add(obj.Id);
            return hash.ToHashCode();
        }
    }
}
