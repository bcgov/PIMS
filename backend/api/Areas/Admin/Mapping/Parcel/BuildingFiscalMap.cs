using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Mapping.Parcel
{
    public class BuildingFiscalMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BuildingFiscal, Model.BuildingFiscalModel>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();


            config.NewConfig<Model.BuildingFiscalModel, Entity.BuildingFiscal>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
