using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Mapping.Parcel
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
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Latitude, src => src.Latitude)
                .Map(dest => dest.Longitude, src => src.Longitude)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
