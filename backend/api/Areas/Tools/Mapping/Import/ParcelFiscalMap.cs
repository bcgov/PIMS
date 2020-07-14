using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class ParcelFiscalMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelFiscal, Model.ParcelFiscalModel>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();


            config.NewConfig<Model.ParcelFiscalModel, Entity.ParcelFiscal>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
