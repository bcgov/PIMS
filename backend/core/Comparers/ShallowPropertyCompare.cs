using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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

            foreach (var p in props.OrderBy(p => p.Name))
            {
                var value = p.GetValue(obj);

                if (value == null) continue;
                if (p.PropertyType.IsValueType || p.PropertyType == typeof(string) || p.PropertyType.IsNullableType())
                    hash.Add(value);
                else if (p.PropertyType == typeof(byte[]))
                {
                    var data = (byte[])p.GetValue(obj);
                    data.ForEach(v => hash.Add(v));
                }
            }

            return hash.ToHashCode();
        }
        #endregion
    }
}
