using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class BuildingEvaluationMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BuildingEvaluation, Model.BuildingEvaluationModel>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();


            config.NewConfig<Model.BuildingEvaluationModel, Entity.BuildingEvaluation>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
