using System;
using AutoMapper;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles
{
    public class BuildingProfile : Profile
    {
        #region Constructors
        public BuildingProfile()
        {
            CreateMap<Entity.Building, Model.Parts.BuildingModel>();

            CreateMap<Model.Parts.BuildingModel, Entity.Building>();

            CreateMap<Entity.Building, Model.Parts.ParcelBuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<Model.Parts.ParcelBuildingModel, Entity.Building>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id));

            CreateMap<Entity.Building, Model.BuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<Model.BuildingModel, Entity.Building>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id));
        }
        #endregion
    }
}
