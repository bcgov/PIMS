using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using BModel = Pims.Api.Models;

namespace Pims.Api.Areas.Property.Mapping.Parcel
{
    public class ParcelFiscalMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelFiscal, Model.ParcelFiscalModel>()
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.EffectiveDate, src => src.EffectiveDate)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelFiscalModel, Entity.ParcelFiscal>()
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.EffectiveDate, src => src.EffectiveDate)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();
        }
    }
}
