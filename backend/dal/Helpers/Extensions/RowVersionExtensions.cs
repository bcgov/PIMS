using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using System;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// RowVersionExtensions static class, provides extension methods for RowVersions.
    /// </summary>
    public static class RowVersionExtensions
    {
        /// <summary>
        /// Convert the string rowversion to a byte array.
        /// </summary>
        /// <param name="rowversion"></param>
        /// <returns></returns>
        public static byte[] ConvertRowVersion(this string rowversion)
        {
            return Convert.FromBase64String(rowversion);
        }

        /// <summary>
        /// Convert the byte array rowversion to a string.
        /// </summary>
        /// <param name="rowversion"></param>
        /// <returns></returns>
        public static string ConvertRowVersion(this byte[] rowversion)
        {
            return Convert.ToBase64String(rowversion);
        }

        /// <summary>
        /// Extract the rowversion from the entity and convert to a string.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public static string GetRowVersion(this BaseEntity entity)
        {
            return Convert.ToBase64String(entity.RowVersion);
        }

        /// <summary>
        /// Copy the rowversion into the destination entity so that EF concurrency will work.
        /// </summary>
        /// <param name="dest"></param>
        /// <param name="rowversion"></param>
        public static void SetRowVersion(this BaseEntity dest, string rowversion)
        {
            var rv = Convert.FromBase64String(rowversion);
            Buffer.BlockCopy(rv, 0, dest.RowVersion, 0, rv.Length);
        }

        /// <summary>
        /// Copy the rowversion from the source entity to the destination entity so that EF concurrency will work.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="dest"></param>
        public static void CopyRowVersionTo(this BaseEntity source, BaseEntity dest)
        {
            if (source.RowVersion != null)
            {
                if (dest.RowVersion == null)
                {
                    dest.RowVersion = source.RowVersion;
                }
                else
                {
                    Buffer.BlockCopy(source.RowVersion, 0, dest.RowVersion, 0, source.RowVersion.Length);
                }
            }
        }

        /// <summary>
        /// If the RowVersion of the specified entity is null it will throw a RowVersionMissingException.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="RowVersionException">The RowVersion cannot be null.</exception>
        public static void ThrowIfRowVersionNull<T>(this T entity, string message = null) where T : BaseEntity
        {
            if (entity?.RowVersion == null) throw new RowVersionMissingException(message);
        }
    }
}
