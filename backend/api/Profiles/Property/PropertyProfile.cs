using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Property;

namespace Pims.Api.Profiles.Property
{
    public class PropertyProfile : Profile
    {
        #region Constructors
        public PropertyProfile()
        {
            CreateMap<Entity.Parcel, Model.PropertyModel>()
                .ForMember(dest => dest.PropertyTypeId, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity));

            CreateMap<Entity.Building, Model.PropertyModel>()
                .ForMember(dest => dest.PropertyTypeId, opt => opt.MapFrom(src => 1))
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.Parcel.ParcelIdentity));
        }
        #endregion
    }
}
