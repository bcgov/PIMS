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
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .IncludeBase<BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.BuildingEvaluation, Models.EvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.BuildingId))
                .IncludeBase<Entity.BaseEntity, BaseModel>();

            CreateMap<Models.EvaluationModel, Entity.BuildingEvaluation>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.BuildingId, opt => opt.Ignore())
                .IncludeBase<BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
