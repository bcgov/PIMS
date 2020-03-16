using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// TypeExtensions static class, provides extension methods for Type objects.
    /// </summary>
    public static class TypeExtensions
    {
        #region Variables
        /// <summary>
        /// To speed things up so that we don't have to use reflection to gather properties every time we cache them after doing it the first time.
        /// </summary>
        private static readonly ConcurrentDictionary<Type, IEnumerable<PropertyInfo>> _typeCache = new ConcurrentDictionary<Type, IEnumerable<PropertyInfo>>();
        #endregion

        #region Methods
        /// <summary>
        /// Get the properties for the specified <typeparamref name="Type"/> and cache them in memory.
        /// This method is only useful for instance type objects.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static IEnumerable<PropertyInfo> GetCachedProperties(this Type type)
        {
            if (!_typeCache.TryGetValue(type, out IEnumerable<PropertyInfo> props))
            {
                props = from p in type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                        select p;
                _typeCache.TryAdd(type, props);
            }
            return props;
        }

        /// <summary>
        /// Determine if the specified type is an enumerable.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsEnumerable(this Type type)
        {
            return type.GetInterfaces().Any(t => t.IsGenericType && t.GetGenericTypeDefinition() == typeof(IEnumerable<>));
        }

        /// <summary>
        /// Determine if the specified type is a collection.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsCollection(this Type type)
        {
            return type.GetInterfaces().Any(t => t.IsGenericType && t.GetGenericTypeDefinition() == typeof(ICollection<>));
        }

        /// <summary>
        /// Determine if the type/object is a nullable type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns>True if the type/object is nullable.</returns>
        public static bool IsNullable<T>(this T obj)
        {
            if (obj == null) return true;
            var type = typeof(T);
            if (!type.IsValueType) return true;
            if (Nullable.GetUnderlyingType(type) != null) return true;
            return false;
        }

        /// <summary>
        /// Determine if the type/object is of the specified type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="type"></param>
        /// <returns>True if the type/object is of the specified type.</returns>
        public static bool IsType<T>(this T obj, Type type)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            return typeof(T) == type || obj?.GetType() == type;
        }

        /// <summary>
        /// Determine if the type/object is one of the specified types.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="type"></param>
        /// <returns>True if the type/object is one of the specified types.</returns>
        public static bool IsType<T>(this T obj, params Type[] type)
        {
            return type.Contains(typeof(T)) || type.Contains(obj?.GetType());
        }

        /// <summary>
        /// Get the generic item type of the enumerable type, otherwise just return the type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static Type GetItemType(this Type type)
        {
            if (!type.IsGenericType || !type.IsEnumerable()) return type;
            return type.GetGenericArguments()[0];
        }
        #endregion
    }
}
