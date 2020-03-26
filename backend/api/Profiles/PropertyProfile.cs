using AutoMapper;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class PropertyProfile : Profile
    {
        #region Constructors
        public PropertyProfile()
        {
            CreateMap<Entity.Parcel, Models.Property.PropertyModel>()
                .ForMember(dest => dest.PropertyTypeId, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity));

            CreateMap<Entity.Building, Models.Property.PropertyModel>()
                .ForMember(dest => dest.PropertyTypeId, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.Parcel.ParcelIdentity));
        }
        #endregion
    }
}
