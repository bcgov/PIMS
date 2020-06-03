using Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// AddressExtensions static class, provides extension methods for projects.
    /// </summary>
    public static class AddressExtensions
    {
        /// <summary>
        /// Format address to string.
        /// </summary>
        /// <param name="address"></param>
        /// <returns></returns>
        public static string FormatAddress(this Address address)
        {
            return address != null ? $"{address.Address1} {address.Address2}".Trim() : "";
        }
    }
}
