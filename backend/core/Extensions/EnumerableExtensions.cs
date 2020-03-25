using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Core.Extensions
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
        /// Recursively flatten a tree structure of IEnumerables.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static IEnumerable<T> Flatten<T>(this IEnumerable<T> e, Func<T, IEnumerable<T>> f)
        {
            return e.SelectMany(c => f(c).Flatten(f)).Concat(e);
        }
    }
}
