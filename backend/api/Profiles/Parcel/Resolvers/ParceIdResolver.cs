using AutoMapper;
using Model = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.Parcel.Resolvers
{
    public class ParcelIdResolver : IValueResolver<Model.ParcelModel, Entity.Parcel, int>
    {
        public int Resolve(Model.ParcelModel source, Entity.Parcel destination, int destMember, ResolutionContext context)
        {
            return string.IsNullOrWhiteSpace(source.PID) ? 0 : int.TryParse(source.PID.Replace("-", ""), out int pid) ? pid : 0;
        }
    }
}
