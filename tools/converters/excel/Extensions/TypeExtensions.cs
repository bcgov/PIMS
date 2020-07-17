using System;
using System.Runtime.CompilerServices;

namespace Pims.Tools.Converters.ExcelConverter.Extensions
{
    /// <summary>
    /// TypeExtensions static class, provides extension methods for types.
    /// </summary>
    public static class TypeExtensions
    {

        /// <summary>
        /// Determine if the specific 'type' is a DBNull.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsDbNull(this Type type)
        {
            return type.Name == "DBNull";
        }

        /// <summary>
        /// Determine if the specified 'type' is a tuple.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool IsTuple(this Type type)
        {
            return typeof(ITuple).IsAssignableFrom(type);
        }
    }
}
