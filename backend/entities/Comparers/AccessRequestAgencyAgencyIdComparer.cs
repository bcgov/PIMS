using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class AccessRequestAgencyAgencyIdComparer : IEqualityComparer<AccessRequestAgency>
    {
        public bool Equals([AllowNull] AccessRequestAgency x, [AllowNull] AccessRequestAgency y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] AccessRequestAgency obj)
        {
            var hash = new HashCode();
            hash.Add(obj.AgencyId);
            return hash.ToHashCode();
        }
    }
}
