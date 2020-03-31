using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Profiles.Import.Resolvers
{
    public class ParcelSubAgencyResolver : IValueResolver<Entity.Parcel, Model.ParcelModel, string>
    {
        public string Resolve(Entity.Parcel source, Model.ParcelModel destination, string destMember, ResolutionContext context)
        {
            return source?.Agency?.ParentId == null ? null : source.Agency.Code;
        }
    }
}
