using Mapster;
using Model = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Parcel
{
    public class PartialParcelMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Parcel, Model.PartialParcelModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Latitude, src => src.Latitude)
                .Map(dest => dest.Longitude, src => src.Longitude)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
