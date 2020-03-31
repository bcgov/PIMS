using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Building;

namespace Pims.Api.Profiles.Building
{
    public class AddressProfile : Profile
    {
        #region Constructors
        public AddressProfile()
        {
            CreateMap<Entity.Address, Model.AddressModel>()
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(dest => dest.Province, opt => opt.MapFrom(src => src.Province.Name))
                .ForMember(dest => dest.Line1, opt => opt.MapFrom(src => src.Address1))
                .ForMember(dest => dest.Line2, opt => opt.MapFrom(src => src.Address2))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.AddressModel, Entity.Address>()
                .ForMember(dest => dest.City, opt => opt.Ignore())
                .ForMember(dest => dest.Province, opt => opt.Ignore())
                .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.Line1))
                .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.Line2))
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
