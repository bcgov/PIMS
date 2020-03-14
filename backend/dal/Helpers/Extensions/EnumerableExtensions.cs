using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// EnumerableExtensions static class, provides extension methods for Enumerables.
    /// </summary>
    public static class EnumerableExtensions
    {
        /// <summary>
        /// Iterates through the enumerable collection and performs the specified action.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="action"></param>
        /// <typeparam name="T"></typeparam>
        public static void ForEach<T>(this IEnumerable<T> items, Action<T> action)
        {
            foreach (var item in items)
            {
                action.Invoke(item);
            }
        }

        /// <summary>
        /// Throw an ArgumentNullException if the item is null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T ThrowIfNull<T>(this T item, string paramName) where T : class
        {
            if (item == null)
            {
                throw new ArgumentNullException(paramName);
            }

            return item;
        }

        public static IEnumerable<T> Flatten<T>(this IEnumerable<T> e, Func<T, IEnumerable<T>> f)
        {
            return e.SelectMany(c => f(c).Flatten(f)).Concat(e);
        }
    }
}
