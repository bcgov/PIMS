using AutoMapper;
using Pims.Api.Data.Entities;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace backend.Helpers.Profiles.Converters
{
    public class ParcelSubAgencyResolver : IValueResolver<Entity.Parcel, Model.ParcelModel, string>
    {
        public string Resolve(Parcel source, Model.ParcelModel destination, string destMember, ResolutionContext context)
        {
            return source?.Agency?.ParentId == null ? null : source.Agency.Code;
        }
    }
}
