using System.Collections.Generic;
using MapsterMapper;
using Entity = Pims.Dal.Entities;


namespace Pims.Api.Mapping.Converters
{
    /// <summary>
    /// AgencyConverter static class, provides converters for agency.
    /// </summary>
    public static class AgencyConverter
    {
        public static string ConvertAgency(Entity.Agency source)
        {
            if (source?.ParentId == null) return source?.Code;
            return source.Parent?.Code;
        }

        public static string ConvertSubAgency(Entity.Agency source)
        {
            return source?.ParentId == null ? null : source.Code;
        }

        public static ICollection<Entity.AccessRequestAgency> ConvertAgency(this IMapper mapper, Entity.AccessRequest destination, Models.User.AccessRequestModel source, IEnumerable<Models.User.AgencyModel> sourceMember)
        {
            foreach (var agency in sourceMember)
            {
                var accessRequestAgency = mapper.Map<Entity.AccessRequestAgency>(agency);
                accessRequestAgency.AccessRequestId = source.Id;
                destination.Agencies.Add(accessRequestAgency);
            }
            return destination.Agencies;
        }
    }
}
