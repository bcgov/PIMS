using AutoMapper;
using Model = Pims.Api.Models.Building;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.Building
{
    public class BuildingProfile : Profile
    {
        #region Constructors
        public BuildingProfile()
        {
            CreateMap<Entity.Building, Model.BuildingModel>()
                .ForMember(dest => dest.BuildingConstructionType, opt => opt.MapFrom(src => src.BuildingConstructionType.Name))
                .ForMember(dest => dest.BuildingPredominateUse, opt => opt.MapFrom(src => src.BuildingPredominateUse.Name));

            CreateMap<Model.BuildingModel, Entity.Building>() // TODO: Map evaluation
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
