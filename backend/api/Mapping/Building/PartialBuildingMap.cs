using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Building;

namespace Pims.Api.Mapping.Building
{
    public class PartialBuildingMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Building, Model.PartialBuildingModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.LocalId, src => src.LocalId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Latitude)
                .Map(dest => dest.Longitude, src => src.Longitude)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
