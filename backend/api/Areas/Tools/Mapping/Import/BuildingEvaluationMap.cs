using Mapster;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class BuildingEvaluationMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BuildingEvaluation, Model.BuildingEvaluationModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.NetBookValue, src => src.NetBookValue)
                .Map(dest => dest.EstimatedValue, src => src.EstimatedValue)
                .Map(dest => dest.AssessedValue, src => src.AssessedValue)
                .Map(dest => dest.AppraisedValue, src => src.AppraisedValue)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();


            config.NewConfig<Model.BuildingEvaluationModel, Entity.BuildingEvaluation>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.NetBookValue, src => src.NetBookValue)
                .Map(dest => dest.EstimatedValue, src => src.EstimatedValue)
                .Map(dest => dest.AssessedValue, src => src.AssessedValue)
                .Map(dest => dest.AppraisedValue, src => src.AppraisedValue)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
