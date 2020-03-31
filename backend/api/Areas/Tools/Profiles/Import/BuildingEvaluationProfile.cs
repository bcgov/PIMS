using AutoMapper;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Profiles.Import
{
    public class BuildingEvaluationProfile : Profile
    {
        #region Constructors
        public BuildingEvaluationProfile()
        {
            CreateMap<Entity.BuildingEvaluation, Model.BuildingEvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.BuildingId))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.BuildingEvaluationModel, Entity.BuildingEvaluation>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.BuildingId, opt => opt.Ignore())
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
