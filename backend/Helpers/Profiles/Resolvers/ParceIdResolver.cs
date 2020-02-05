using AutoMapper;
using Pims.Api.Data.Entities;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace backend.Helpers.Profiles.Converters
{
    public class ParcelIdResolver : IValueResolver<Model.ParcelModel, Entity.Parcel, int>
    {
        public int Resolve(Model.ParcelModel source, Entity.Parcel destination, int destMember, ResolutionContext context)
        {
            return string.IsNullOrWhiteSpace(source.PID) ? 0 : int.TryParse(source.PID.Replace("-", ""), out int pid) ? pid : 0;
        }
    }
}
