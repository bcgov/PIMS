using System.Diagnostics.CodeAnalysis;

namespace Pims.Core.Comparers
{
    /// <summary>
    /// DeepPropertyCompare class, provides a simple way to deep compare two objects of the same type.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DeepPropertyCompare<T> : DeepPropertyCompare
    {
        /// <summary>
        /// Determines if the objects public properties are equal.
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns></returns>
        public bool Equals([AllowNull] T x, [AllowNull] T y)
        {
            return base.Equals(x, y);
        }

        /// <summary>
        /// Get the hash code for all the public properties.
        /// Ignores child objects.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int GetHashCode([DisallowNull] T obj)
        {
            return base.GetHashCode(obj);
        }
    }
}
