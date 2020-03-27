using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class EvaluationProfile : Profile
    {
        #region Constructors
        public EvaluationProfile()
        {
            CreateMap<Entity.ParcelEvaluation, Models.EvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.ParcelId))
                .IncludeBase<Entity.BaseEntity, BaseModel>();

            CreateMap<Models.EvaluationModel, Entity.ParcelEvaluation>()
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.PropertyId))
                .IncludeBase<BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.BuildingEvaluation, Models.EvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.BuildingId))
                .IncludeBase<Entity.BaseEntity, BaseModel>();

            CreateMap<Models.EvaluationModel, Entity.BuildingEvaluation>()
                .ForMember(dest => dest.BuildingId, opt => opt.MapFrom(src => src.PropertyId))
                .IncludeBase<BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
