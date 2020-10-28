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
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
