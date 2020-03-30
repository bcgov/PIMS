using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Profiles.Parcel
{
    public class BuildingEvaluationProfile : Profile
    {
        #region Constructors
        public BuildingEvaluationProfile()
        {
            CreateMap<Entity.BuildingEvaluation, Model.BuildingEvaluationModel>()
                .ForMember(dest => dest.BuildingId, opt => opt.MapFrom(src => src.BuildingId))
                .IncludeBase<Entity.BaseEntity, BModel.BaseModel>();

            CreateMap<Model.BuildingEvaluationModel, Entity.BuildingEvaluation>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.BuildingId, opt => opt.Ignore())
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
