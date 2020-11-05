using Pims.Core.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection;

namespace Pims.Core.Comparers
{
    /// <summary>
    /// DeepPropertyCompare class, provides a simple way to deep compare two objects of the same type.
    /// </summary>
    public class DeepPropertyCompare : IEqualityComparer<object>
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
            // Only root objects cannot be null.  Child objects that are null will be equal.
            if (x == null || y == null || GetHashCode(x) != GetHashCode(y) || x.GetType() != y.GetType()) return false;
            if (x == y) return true;

            var type = x.GetType();
            var children = type.GetCachedProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty).Where(p => !p.PropertyType.IsValueType && p.PropertyType != typeof(string) && !p.PropertyType.IsEnumerable());
            foreach (var p in children.Where(p => !p.GetIndexParameters().Any()))
            {
                var cx = p.GetValue(x);
                var cy = p.GetValue(y);
                if ((cx == null && cy != null) || (cx != null && cy == null)) return false;
                if (cx == null && cy == null) return true; // Both are null, therefore equal.

                var sct = typeof(DeepPropertyCompare<>);
                var scgt = sct.MakeGenericType(p.PropertyType);
                var csc = Activator.CreateInstance(scgt);
                var method = scgt.GetMethod(nameof(Equals), BindingFlags.Public | BindingFlags.Instance, null, new[] { p.PropertyType, p.PropertyType }, null)
                        ?? scgt.GetMethod(nameof(Equals), BindingFlags.Public | BindingFlags.Instance, null, new[] { typeof(object), typeof(object) }, null);

                if (!(bool)method.Invoke(csc, new[] { cx, cy })) return false;
            }

            var collections = type.GetCachedProperties().Where(p => p.PropertyType != typeof(string) && p.PropertyType.IsEnumerable());
            foreach (var p in collections)
            {
                var cx = p.GetValue(x);
                var cy = p.GetValue(y);

                // Have to manually force them into lists... I hate this way.
                var lcx = new ArrayList();
                foreach (var item in (IEnumerable)cx)
                {
                    lcx.Add(item);
                }

                var lcy = new ArrayList();
                foreach (var item in (IEnumerable)cy)
                {
                    lcy.Add(item);
                }

                if (lcx.Count != lcy.Count) return false;

                for (var i = 0; i < lcx.Count; i++)
                {
                    var cxitem = lcx[i];
                    var cyitem = lcy[i];

                    if ((cxitem == null && cyitem != null) || (cxitem != null && cyitem == null)) return false;
                    if (cxitem == null && cyitem == null) return true; // Both are null, therefore equal.

                    var ctype = p.PropertyType.GetItemType();
                    var sct = typeof(DeepPropertyCompare<>);
                    var scgt = sct.MakeGenericType(ctype);
                    var csc = Activator.CreateInstance(scgt);
                    var method = scgt.GetMethod(nameof(Equals), BindingFlags.Public | BindingFlags.Instance, null, new[] { ctype, ctype }, null)
                        ?? scgt.GetMethod(nameof(Equals), BindingFlags.Public | BindingFlags.Instance, null, new[] { typeof(object), typeof(object) }, null);

                    if (!(bool)method.Invoke(csc, new[] { cxitem, cyitem })) return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Get the hash code for all the public properties.
        /// Ignores child objects.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int GetHashCode([DisallowNull] object obj)
        {
            var hash = new HashCode();

            var props = obj.GetType().GetCachedProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.GetProperty);

            foreach (var p in props.Where(p => !p.GetIndexParameters().Any()))
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
