using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Profiles.Parcel.Resolvers
{
    public class ParcelSubAgencyResolver : IValueResolver<Entity.Parcel, Model.ParcelModel, string>
    {
        public string Resolve(Entity.Parcel source, Model.ParcelModel destination, string destMember, ResolutionContext context)
        {
            return source?.Agency?.ParentId == null ? null : source.Agency.Code;
        }
    }
}
