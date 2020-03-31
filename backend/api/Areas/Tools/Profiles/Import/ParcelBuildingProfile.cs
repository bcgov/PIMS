using AutoMapper;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Profiles.Import
{
    public class ParcelBuildingProfile : Profile
    {
        #region Constructors
        public ParcelBuildingProfile()
        {
            CreateMap<Entity.Building, Model.ParcelBuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<Model.ParcelBuildingModel, Entity.Building>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.Ignore())
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .ForMember(dest => dest.Parcel, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Evaluations, opt => opt.Ignore())
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
