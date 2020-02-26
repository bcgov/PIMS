using AutoMapper;
using Pims.Api.Models;
using Pims.Dal.Entities;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace backend.Helpers.Profiles.Converters
{
    public class ParcelSubAgencyResolver : IValueResolver<Entity.Parcel, ParcelModel, string>
    {
        public string Resolve(Parcel source, ParcelModel destination, string destMember, ResolutionContext context)
        {
            return source?.Agency?.ParentId == null ? null : source.Agency.Code;
        }
    }
}
