using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// CollectionExtensions static class, provides extension methods for Enumerables.
    /// </summary>
    public static class CollectionExtensions
    {
        /// <summary>
        /// Provides a way to mutate a collection by removing all items that match the 'find' statement.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="find"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static ICollection<T> RemoveAll<T>(this ICollection<T> items, Func<T, bool> find)
        {
            var remove = items.Where(find).ToArray();

            foreach (var item in remove)
            {
                items.Remove(item);
            }

            return items;
        }
    }
}
