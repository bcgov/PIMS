using System.Diagnostics.CodeAnalysis;

namespace Pims.Core.Comparers
{
    /// <summary>
    /// ShallowPropertyCompare class, provides a simple way to shallow compare two objects of the same type.
    /// This compares only public properties, but ignores most non-value type properties (i.e Classes)
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ShallowPropertyCompare<T> : ShallowPropertyCompare
    {
        #region Methods
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
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public int GetHashCode([DisallowNull] T obj)
        {
            return base.GetHashCode(obj);
        }
        #endregion
    }
}
