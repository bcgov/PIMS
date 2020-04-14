using Mapster;
using Model = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Mapping.Parcel
{
    public class ParcelEvaluationMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelEvaluation, Model.ParcelEvaluationModel>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Model.ParcelEvaluationModel, Entity.ParcelEvaluation>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
