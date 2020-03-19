using AutoMapper;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles.Converters
{
    public class ParcelSubAgencyConverter : IValueConverter<Entity.Agency, string>
    {
        public string Convert(Entity.Agency sourceMember, ResolutionContext context)
        {
            if (sourceMember?.ParentId == null) return null;
            return sourceMember.Code;
        }
    }
}
