using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Profiles.Parcel
{
    public class ParcelEvaluationProfile : Profile
    {
        #region Constructors
        public ParcelEvaluationProfile()
        {
            CreateMap<Entity.ParcelEvaluation, Model.ParcelEvaluationModel>()
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom(src => src.ParcelId))
                .IncludeBase<Entity.BaseEntity, BModel.BaseModel>();

            CreateMap<Model.ParcelEvaluationModel, Entity.ParcelEvaluation>()
                .ForMember(dest => dest.FiscalYear, opt => opt.MapFrom(src => src.FiscalYear))
                .ForMember(dest => dest.EstimatedValue, opt => opt.MapFrom(src => src.EstimatedValue))
                .ForMember(dest => dest.AssessedValue, opt => opt.MapFrom(src => src.AssessedValue))
                .ForMember(dest => dest.AppraisedValue, opt => opt.MapFrom(src => src.AppraisedValue))
                .ForMember(dest => dest.NetBookValue, opt => opt.MapFrom(src => src.NetBookValue))
                .ForMember(dest => dest.ParcelId, opt => opt.Ignore())
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
