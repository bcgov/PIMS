using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace backend.Helpers.Profiles.Converters
{
    public class ParcelIdResolver : IValueResolver<ParcelModel, Entity.Parcel, int>
    {
        public int Resolve(ParcelModel source, Entity.Parcel destination, int destMember, ResolutionContext context)
        {
            return string.IsNullOrWhiteSpace(source.PID) ? 0 : int.TryParse(source.PID.Replace("-", ""), out int pid) ? pid : 0;
        }
    }
}
