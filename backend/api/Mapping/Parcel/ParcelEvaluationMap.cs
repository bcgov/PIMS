using Mapster;
using Model = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Parcel
{
    public class ParcelEvaluationMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelEvaluation, Model.ParcelEvaluationModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.NetBookValue, src => src.NetBookValue)
                .Map(dest => dest.EstimatedValue, src => src.EstimatedValue)
                .Map(dest => dest.AssessedValue, src => src.AssessedValue)
                .Map(dest => dest.AppraisedValue, src => src.AppraisedValue)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Model.ParcelEvaluationModel, Entity.ParcelEvaluation>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.NetBookValue, src => src.NetBookValue)
                .Map(dest => dest.EstimatedValue, src => src.EstimatedValue)
                .Map(dest => dest.AssessedValue, src => src.AssessedValue)
                .Map(dest => dest.AppraisedValue, src => src.AppraisedValue)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
