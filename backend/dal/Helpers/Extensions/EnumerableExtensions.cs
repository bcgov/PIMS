using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

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

        /// <summary>
        /// Provides a way to remove all items from the collection that match the find statement.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="find"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static IEnumerable<T> RemoveAll<T>(this IEnumerable<T> items, Func<T, bool> find)
        {
            var list = items.ToList();
            var remove = list.Where(find);

            foreach (var item in remove)
            {
                list.Remove(item);
            }

            return list;
        }
    }
}
