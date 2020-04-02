using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Building;
using Pims.Api.Helpers.Extensions;

namespace Pims.Api.Profiles.Building
{
    public class PartialBuildingProfile : Profile
    {
        #region Constructors
        public PartialBuildingProfile()
        {
            CreateMap<Entity.Building, Model.PartialBuildingModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.PartialBuildingModel, Entity.Building>()
                .IgnoreAllUnmapped()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
