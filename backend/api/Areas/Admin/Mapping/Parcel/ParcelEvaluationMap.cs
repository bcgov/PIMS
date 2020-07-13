using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Mapping.Parcel
{
    public class ParcelEvaluationMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelEvaluation, Model.ParcelEvaluationModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();


            config.NewConfig<Model.ParcelEvaluationModel, Entity.ParcelEvaluation>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Date, src => src.Date)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
