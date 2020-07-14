using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace Pims.Core.Extensions
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
        private static readonly ConcurrentDictionary<Type, IEnumerable<ConstructorInfo>> _typeConstructorCache = new ConcurrentDictionary<Type, IEnumerable<ConstructorInfo>>();
        #endregion

        #region Methods
        /// <summary>
        /// Creates a basic new instance of the specified type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Argument is required for extension method.")]
        public static T CreateInstance<T>(this Type type)
        {
            return (T)Activator.CreateInstance<T>();
        }

        /// <summary>
        /// Get the properties for the specified <typeparamref name="Type"/> and cache them in memory.
        /// This method is only useful for instance type objects.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="bindingFlags"></param>
        /// <returns></returns>
        public static IEnumerable<PropertyInfo> GetCachedProperties(this Type type, BindingFlags bindingFlags = BindingFlags.Public | BindingFlags.Instance)
        {
            return _typeCache.GetOrAdd(type, (key) => from p in type.GetProperties(bindingFlags)
                                                      select p);
        }

        /// <summary>
        /// Get the properties for the specified <typeparamref name="Type"/> and cache them in memory.
        /// This method is only useful for instance type objects.
        /// Note
        ///     If there are multiple property members with the same name this will throw an exception
        ///     because it's expecting unique property names.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="bindingFlags"></param>
        /// <returns></returns>
        public static IDictionary<string, PropertyInfo> GetCachedPropertiesAsDictionary(this Type type, BindingFlags bindingFlags = BindingFlags.Public | BindingFlags.Instance)
        {
            return _typeCache.GetOrAdd(type, (key) => from p in type.GetProperties(bindingFlags)
                                                      select p).ToImmutableDictionary(p => p.Name);
        }

        /// <summary>
        /// Get the constructors for the specified <typeparamref name="Type"/> and cache them in memory.
        /// This method is only useful for instance type objects.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="bindingFlags"></param>
        /// <returns></returns>
        public static IEnumerable<ConstructorInfo> GetCachedConstructors(this Type type, BindingFlags bindingFlags = BindingFlags.Public | BindingFlags.Instance)
        {
            return _typeConstructorCache.GetOrAdd(type, (key) => from p in type.GetConstructors(bindingFlags)
                                                                 select p);
        }

        /// <summary>
        /// Determine if the specified type is an enumerable.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsEnumerable(this Type type, bool notString = true)
        {
            return typeof(IEnumerable).IsAssignableFrom(type) && (!notString || type != typeof(string));
        }

        /// <summary>
        /// Determine if the specified type is an IEnumerable.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsIEnumerable(this Type type)
        {
            return type.GetInterfaces().Any(t => t.IsGenericType && t.GetGenericTypeDefinition() == typeof(IEnumerable<>));
        }

        /// <summary>
        /// Determine if the specified type is a ICollection.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsICollection(this Type type)
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
        /// Determine if the type/object is a nullable type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns>True if the type/object is nullable.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Argument is required for extension method.")]
        public static bool IsNullableType<T>(this T obj)
        {
            var type = typeof(T);
            return Nullable.GetUnderlyingType(type) != null;
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
            if (!type.IsGenericType)
            {
                if (type.IsEnumerable())
                    return type.GetElementType();
                return type;
            }
            return type.GetGenericArguments()[0];
        }

        /// <summary>
        /// Get the method for the specified 'name', 'bindingFlags' and 'parameterTypes'.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <param name="bindingFlags"></param>
        /// <param name="parameterTypes"></param>
        /// <returns></returns>
        public static MethodInfo FindMethod(this Type type, string name, BindingFlags bindingFlags, params Type[] parameterTypes)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException($"Argument cannot be null, empty or whitespace.", nameof(name));

            return type.GetMethod(name, bindingFlags, null, CallingConventions.Any, parameterTypes, null);
        }

        /// <summary>
        /// Get the default public instance method for the specified 'name' and 'parameterTypes'.
        /// By default it will find the method without parameters.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <param name="parameterTypes"></param>
        /// <returns></returns>
        public static MethodInfo FindMethod(this Type type, string name, params Type[] parameterTypes)
        {
            if (!parameterTypes.Any()) parameterTypes = new Type[0];
            return type.FindMethod(name, BindingFlags.Instance | BindingFlags.Public, parameterTypes);
        }

        /// <summary>
        /// Determine if the specified type is an anonymous type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsAnonymousType(this Type type)
        {
            if (type == null)
                throw new ArgumentNullException("type");

            // HACK: The only way to detect anonymous types right now.
            return Attribute.IsDefined(type, typeof(CompilerGeneratedAttribute), false)
                && type.IsGenericType && type.Name.Contains("AnonymousType")
                && (type.Name.StartsWith("<>") || type.Name.StartsWith("VB$"))
                && type.Attributes.HasFlag(TypeAttributes.NotPublic);
        }

        /// <summary>
        /// Create a default value for the specified 'type'.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static object GetDefault(this Type type)
        {
            if (type.IsValueType)
                return Activator.CreateInstance(type);
            return null;
        }
        #endregion
    }
}
