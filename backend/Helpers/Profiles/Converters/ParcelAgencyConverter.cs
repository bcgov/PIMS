using AutoMapper;
using Pims.Api.Data.Entities;
using Entity = Pims.Api.Data.Entities;

namespace backend.Helpers.Profiles.Converters
{
    public class ParcelAgencyConverter : IValueConverter<Entity.Agency, string>
    {
        public string Convert(Entity.Agency sourceMember, ResolutionContext context)
        {
            if (sourceMember?.ParentId == null) return sourceMember?.Code;
            return sourceMember.Parent.Code;
        }
    }
}
