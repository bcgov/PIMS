using AutoMapper;
using Pims.Api.Data.Entities;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace backend.Helpers.Profiles.Converters
{
    public class LocalIdResolver : IValueResolver<Model.ParcelModel, Entity.Parcel, int>
    {
        public int Resolve(Model.ParcelModel source, Entity.Parcel destination, int destMember, ResolutionContext context)
        {
            return string.IsNullOrWhiteSpace(source.LID) ? 0 : int.TryParse(source.LID.Replace("-", ""), out int lid) ? lid : 0;
        }
    }
}
