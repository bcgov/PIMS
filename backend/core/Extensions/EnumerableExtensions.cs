using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        /// <param name="action"></param>
        /// <typeparam name="T"></typeparam>
        public static void ForEach<T>(this IEnumerable<T> items, Action<T, int> action)
        {
            var i = 0;
            foreach (var item in items)
            {
                action.Invoke(item, i++);
            }
        }

        /// <summary>
        /// Iterates through the enumerable collection and performs the specified action.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="action"></param>
        /// <typeparam name="T"></typeparam>
        public static async Task ForEachAsync<T>(this IEnumerable<T> items, Func<T, Task> action)
        {
            await Task.WhenAll(items.Select(i => action.Invoke(i)).ToArray());
        }

        /// <summary>
        /// Iterates through the enumerable collection and performs the specified action.
        /// Increments the index and passes it to the action.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="action"></param>
        /// <typeparam name="T"></typeparam>
        public static async Task ForEachAsync<T>(this IEnumerable<T> items, Func<T, int, Task> action)
        {
            var index = 0;
            await Task.WhenAll(items.Select(i => action.Invoke(i, index++)).ToArray());
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

        /// <summary>
        /// Return a new enumerable by extracting all items that are null.
        /// </summary>
        /// <param name="items"></param>
        /// <returns></returns>
        public static IEnumerable<T> NotNull<T>(this IEnumerable<T> items)
        {
            return items.Where(v => v != null);
        }

        /// <summary>
        /// Return a new enumerable by extracting all items that are null or empty or whitespace.
        /// </summary>
        /// <param name="items"></param>
        /// <returns></returns>
        public static IEnumerable<T> NotNullOrWhiteSpace<T>(this IEnumerable<T> items)
        {
            return items.Where(v => v != null && !String.IsNullOrWhiteSpace($"{v}"));
        }

        /// <summary>
        /// Return a new enumerable with only distinct values based on the comparer.
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="source"></param>
        /// <param name="keySelector"></param>
        /// <returns></returns>
        public static IEnumerable<TSource> DistinctBy<TSource, TKey>(this IEnumerable<TSource> source, Func<TSource, TKey> keySelector)
        {
            var seenKeys = new HashSet<TKey>();
            foreach (TSource element in source)
            {
                if (seenKeys.Add(keySelector(element)))
                {
                    yield return element;
                }
            }
        }
    }
}
