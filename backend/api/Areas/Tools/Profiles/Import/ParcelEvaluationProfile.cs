using AutoMapper;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Profiles.Import
{
    public class ParcelEvaluationProfile : Profile
    {
        #region Constructors
        public ParcelEvaluationProfile()
        {
            CreateMap<Entity.ParcelEvaluation, Model.ParcelEvaluationModel>()
                .ForMember(dest => dest.PropertyId, opt => opt.MapFrom(src => src.ParcelId))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            CreateMap<Model.ParcelEvaluationModel, Entity.ParcelEvaluation>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
