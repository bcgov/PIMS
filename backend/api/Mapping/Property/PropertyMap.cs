using Mapster;
using Model = Pims.Api.Models.Property;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Property
{
    public class PropertyMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Parcel, Model.PropertyModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.PropertyTypeId, src => 0)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Latitude, src => src.Latitude)
                .Map(dest => dest.Longitude, src => src.Longitude);


            config.NewConfig<Entity.Building, Model.PropertyModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.PropertyTypeId, src => 1)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Latitude)
                .Map(dest => dest.Longitude, src => src.Longitude);
        }
    }
}
