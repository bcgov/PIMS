using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Entities.Comparers
{
    public class AgencyIdComparer : IEqualityComparer<Agency>
    {
        public bool Equals([AllowNull] Agency x, [AllowNull] Agency y)
        {
            return (x == null || y == null) ? false : GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] Agency obj)
        {
            var hash = new HashCode();
            hash.Add(obj.Id);
            return hash.ToHashCode();
        }
    }
}
