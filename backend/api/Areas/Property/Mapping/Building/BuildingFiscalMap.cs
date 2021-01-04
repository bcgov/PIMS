using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Building;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Mapping.Building
{
    public class BuildingFiscalMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BuildingFiscal, Model.BuildingFiscalModel>()
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.EffectiveDate, src => src.EffectiveDate)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();


            config.NewConfig<Model.BuildingFiscalModel, Entity.BuildingFiscal>()
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.EffectiveDate, src => src.EffectiveDate)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();
        }
    }
}
