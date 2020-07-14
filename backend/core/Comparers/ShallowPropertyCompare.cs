using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Pims.Core.Comparers
{
    /// <summary>
    /// ShallowPropertyCompare class, provides a simple way to shallow compare two objects of the same type.
    /// This compares only public properties, but ignores most non-value type properties (i.e Classes)
    /// </summary>
    public class ShallowPropertyCompare : IEqualityComparer<object>
    {
        #region Methods
        /// <summary>
        /// Determines if the objects public properties are equal.
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns></returns>
        public new bool Equals([AllowNull] object x, [AllowNull] object y)
        {
            if (x == null || y == null || GetHashCode(x) != GetHashCode(y)) return false;
            return true;
        }

        /// <summary>
        /// Get the hash code for all the public properties.
        /// Ignores child objects.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int GetHashCode(object obj)
        {
            var hash = new HashCode();

            var props = obj.GetType().GetCachedProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty);

            foreach (var p in props)
            {
                if (p.PropertyType.IsValueType || p.PropertyType == typeof(string) || p.PropertyType.IsNullableType())
                    hash.Add(p.GetValue(obj));
                else if (p.PropertyType == typeof(byte[]))
                {
                    var value = (byte[])p.GetValue(obj);
                    value.ForEach(v => hash.Add(v));
                }
            }

            return hash.ToHashCode();
        }
        #endregion
    }
}
