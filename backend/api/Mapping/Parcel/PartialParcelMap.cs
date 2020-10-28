using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Parcel;

namespace Pims.Api.Mapping.Parcel
{
    public class PartialParcelMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Parcel, Model.PartialParcelModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
