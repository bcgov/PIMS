using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class UserRoleRoleIdComparer : IEqualityComparer<UserRole>
    {
        public bool Equals([AllowNull] UserRole x, [AllowNull] UserRole y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] UserRole obj)
        {
            var hash = new HashCode();
            hash.Add(obj.RoleId);
            return hash.ToHashCode();
        }
    }
}
