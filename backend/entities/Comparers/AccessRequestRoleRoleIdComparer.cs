using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class AccessRequestRoleRoleIdComparer : IEqualityComparer<AccessRequestRole>
    {
        public bool Equals([AllowNull] AccessRequestRole x, [AllowNull] AccessRequestRole y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] AccessRequestRole obj)
        {
            var hash = new HashCode();
            hash.Add(obj.RoleId);
            return hash.ToHashCode();
        }
    }
}
