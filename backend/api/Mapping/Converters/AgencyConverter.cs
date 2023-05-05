using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Converters
{
    /// <summary>
    /// AgencyConverter static class, provides converters for agency.
    /// </summary>
    public static class AgencyConverter
    {
        /// <summary>
        /// Extracts the agency code, or the specified 'agency' is a child it will return the parent code.
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static string ConvertAgency(Entity.Agency source)
        {
            if (source?.ParentId == null) return source?.Code;
            return source.Parent?.Code;
        }

        /// <summary>
        /// Extract the sub-agency code.
        /// If the specified 'agency' is a parent it will return null.
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static string ConvertSubAgency(Entity.Agency source)
        {
            return source?.ParentId == null ? null : source.Code;
        }

        /// <summary>
        /// Extracts the agency name, or the specified 'agency' is a child it will return the parent code.
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static string ConvertAgencyFullName(Entity.Agency source)
        {
            if (source?.ParentId == null) return source?.Name;
            return source.Parent?.Name;
        }

        /// <summary>
        /// Extract the sub-agency name.
        /// If the specified 'agency' is a parent it will return null.
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static string ConvertSubAgencyFullName(Entity.Agency source)
        {
            return source?.ParentId == null ? null : source.Name;
        }
    }
}
