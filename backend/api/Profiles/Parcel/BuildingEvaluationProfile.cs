using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Parcel;

namespace Pims.Api.Profiles.Parcel
{
    public class BuildingEvaluationProfile : Profile
    {
        #region Constructors
        public BuildingEvaluationProfile()
        {
            CreateMap<Entity.BuildingEvaluation, Model.BuildingEvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.BuildingId))
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.BuildingEvaluationModel, Entity.BuildingEvaluation>()
                .ForMember(dest => dest.BuildingId, opt => opt.MapFrom(src => src.PropertyId))
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.BuildingId, opt => opt.MapFrom(src => src.PropertyId))
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
