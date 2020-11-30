using System;
using System.Linq;
using System.Reflection;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// ObjectExtensions static class, provides extension methods for generic objects.
    /// </summary>
    public static class ObjectExtensions
    {
        /// <summary>
        /// Copies the public properties from the 'source' object to the 'destination' object.
        /// It will only copy public properties that have a 'set' and are of the following types, primitive, enum, string.
        /// Or an array of those same types.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        /// <typeparam name="ST"></typeparam>
        /// <typeparam name="DT"></typeparam>
        public static DT CopyValues<ST, DT>(this ST source, DT destination)
            where ST : class
            where DT : class
        {
            if (destination == null) throw new ArgumentNullException(nameof(destination));

            var type = typeof(DT);
            if (!type.IsClass || (type.IsValueType && !type.IsEnum)) throw new ArgumentException($"The destination type must be an object or struct.", nameof(source));

            var sProps = typeof(ST)
                .GetCachedProperties(BindingFlags.Instance | BindingFlags.Public)
                .Where(p => p.PropertyType.IsPrimitive
                    || p.PropertyType.IsEnum
                    || p.PropertyType == typeof(string)
                    || (p.PropertyType.IsGenericType
                        && p.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>)
                        && Nullable.GetUnderlyingType(p.PropertyType).IsPrimitive)
                    || (p.PropertyType.IsEnumerable()
                        && p.PropertyType.GetItemType().IsPrimitive)).ToDictionary(p => p.Name);
            var dProps = type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.SetProperty);

            foreach (var dProp in dProps)
            {
                if (!sProps.ContainsKey(dProp.Name)) continue;
                var sProp = sProps[dProp.Name];

                if (sProp.PropertyType == dProp.PropertyType)
                {
                    var value = sProp.GetValue(source);
                    if (dProp.PropertyType.IsEnumerable())
                    {
                        if (dProp.PropertyType.IsArray)
                        {
                            var array = value as Array;
                            dProp.SetValue(destination, array, null);
                        }
                    }
                    else
                    {
                        dProp.SetValue(destination, value);
                    }
                }
            }

            return destination;
        }
    }
}
