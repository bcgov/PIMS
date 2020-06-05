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
        /// Iterates through the enumerable collection and performs the specified action.
        /// Increments the index and passes it to the action.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="index"></param>
        /// <param name="action"></param>
        /// <typeparam name="T"></typeparam>
        public static void ForEach<T>(this IEnumerable<T> items, int index, Action<T, int> action)
        {
            var i = index;
            foreach (var item in items)
            {
                action.Invoke(item, i++);
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

        /// <summary>
        /// Quick way to skip and take one.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="skip"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T Next<T>(this IEnumerable<T> items, int skip)
        {
            if (skip < 0) throw new ArgumentException("Argument must be greater than or equal to zero.", nameof(skip));
            return items.Skip(skip).First();
        }

        /// <summary>
        /// Quick way to skip and take the specified quantity.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static IEnumerable<T> Next<T>(this IEnumerable<T> items, int skip, int take)
        {
            if (skip < 0) throw new ArgumentException("Argument must be greater than or equal to zero.", nameof(skip));
            if (take < 1) throw new ArgumentException("Argument must be greater than or equal to 1.", nameof(take));
            return items.Skip(skip).Take(take);
        }
    }
}
