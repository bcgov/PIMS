using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class BuildingProfile : Profile
    {
        #region Constructors
        public BuildingProfile()
        {
            CreateMap<Entity.Building, Models.Parts.BuildingModel>();

            CreateMap<Models.Parts.BuildingModel, Entity.Building>()
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingTenancy, opt => opt.Ignore())
                .ForMember(dest => dest.RentableArea, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.Ignore())
                .IncludeBase<BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Building, Models.Parts.ParcelBuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.Evaluation.FiscalYear))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.Evaluation.AssessedValue))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.Evaluation.EstimatedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.Evaluation.NetBookValue))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<Models.Parts.ParcelBuildingModel, Entity.Building>() // TODO: Map evaluation
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id))
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.Ignore())
                .IncludeBase<BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Building, BuildingModel>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.Evaluation.FiscalYear))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.Evaluation.AssessedValue))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.Evaluation.EstimatedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.Evaluation.NetBookValue))
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<BuildingModel, Entity.Building>() // TODO: Map evaluation
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id));
        }
        #endregion
    }
}
