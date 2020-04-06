using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Profiles.Parcel
{
    public class BuildingProfile : Profile
    {
        #region Constructors
        public BuildingProfile()
        {
            CreateMap<Entity.Building, Model.PartialBuildingModel>();

            CreateMap<Model.PartialBuildingModel, Entity.Building>()
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.Ignore())
                .ForMember(dest => dest.Address, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingOccupantTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingOccupantType, opt => opt.Ignore())
                .ForMember(dest => dest.LeaseExpiry, opt => opt.Ignore())
                .ForMember(dest => dest.OccupantName, opt => opt.Ignore())
                .ForMember(dest => dest.TransferLeaseOnSale, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingTenancy, opt => opt.Ignore())
                .ForMember(dest => dest.RentableArea, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.Ignore())
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Building, Model.BuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name))
                .ForMember(dest => dest.BuildingOccupantType, opt => opt.MapFrom(src => src.BuildingOccupantType.Name));

            CreateMap<Model.BuildingModel, Entity.Building>() // TODO: Map evaluation
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingOccupantType, opt => opt.Ignore())
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id));

            CreateMap<Entity.Building, Model.ParcelBuildingModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.MapFrom(src => src.BuildingConstructionTypeId))
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.MapFrom(src => src.BuildingFloorCount))
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.MapFrom(src => src.BuildingPredominateUseId))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name))
                .ForMember(dest => dest.BuildingOccupantTypeId, opt => opt.MapFrom(src => src.BuildingOccupantTypeId))
                .ForMember(dest => dest.BuildingOccupantType, opt => opt.MapFrom(src => src.BuildingOccupantType.Name))
                .ForMember(dest => dest.OccupantName, opt => opt.MapFrom(src => src.OccupantName))
                .ForMember(dest => dest.TransferLeaseOnSale, opt => opt.MapFrom(src => src.TransferLeaseOnSale))
                .ForMember(dest => dest.LeaseExpiry, opt => opt.MapFrom(src => src.LeaseExpiry))
                .ForMember(dest => dest.BuildingTenancy, opt => opt.MapFrom(src => src.BuildingTenancy))
                .ForMember(dest => dest.RentableArea, opt => opt.MapFrom(src => src.RentableArea))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Evaluations, opt => opt.MapFrom(src => src.Evaluations))
                .IncludeBase<Entity.BaseEntity, BModel.BaseModel>();

            CreateMap<Model.ParcelBuildingModel, Entity.Building>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.LocalId, opt => opt.MapFrom(src => src.LocalId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.BuildingConstructionTypeId, opt => opt.MapFrom(src => src.BuildingConstructionTypeId))
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingFloorCount, opt => opt.MapFrom(src => src.BuildingFloorCount))
                .ForMember(dest => dest.BuildingPredominateUseId, opt => opt.MapFrom(src => src.BuildingPredominateUseId))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingOccupantTypeId, opt => opt.MapFrom(src => src.BuildingOccupantTypeId))
                .ForMember(dest => dest.BuildingOccupantType, opt => opt.Ignore())
                .ForMember(dest => dest.OccupantName, opt => opt.MapFrom(src => src.OccupantName))
                .ForMember(dest => dest.TransferLeaseOnSale, opt => opt.MapFrom(src => src.TransferLeaseOnSale))
                .ForMember(dest => dest.LeaseExpiry, opt => opt.MapFrom(src => src.LeaseExpiry))
                .ForMember(dest => dest.BuildingTenancy, opt => opt.MapFrom(src => src.BuildingTenancy))
                .ForMember(dest => dest.RentableArea, opt => opt.MapFrom(src => src.RentableArea))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Evaluations, opt => opt.MapFrom(src => src.Evaluations))
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
