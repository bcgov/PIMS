using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class UserAgencyAgencyIdComparer : IEqualityComparer<UserAgency>
    {
        public bool Equals([AllowNull] UserAgency x, [AllowNull] UserAgency y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] UserAgency obj)
        {
            var hash = new HashCode();
            hash.Add(obj.AgencyId);
            return hash.ToHashCode();
        }
    }
}
