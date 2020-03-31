using AutoMapper;
using Model = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.Parcel
{
    public class ParcelBuildingProfile : Profile
    {
        #region Constructors
        public ParcelBuildingProfile()
        {
            CreateMap<Entity.Building, Model.ParcelBuildingModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.MapFrom(src => src.BuildingConstructionTypeId))
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.MapFrom(src => src.BuildingFloorCount))
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.MapFrom(src => src.BuildingPredominateUseId))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name))
                .ForMember(dest => dest.BuildingTenancy, opt => opt.MapFrom(src => src.BuildingTenancy))
                .ForMember(dest => dest.RentableArea, opt => opt.MapFrom(src => src.RentableArea))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Evaluations, opt => opt.MapFrom(src => src.Evaluations))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.ParcelBuildingModel, Entity.Building>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.MapFrom(src => src.BuildingConstructionTypeId))
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.MapFrom(src => src.BuildingFloorCount))
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.MapFrom(src => src.BuildingPredominateUseId))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingTenancy, opt => opt.MapFrom(src => src.BuildingTenancy))
                .ForMember(dest => dest.RentableArea, opt => opt.MapFrom(src => src.RentableArea))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Evaluations, opt => opt.MapFrom(src => src.Evaluations))
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
