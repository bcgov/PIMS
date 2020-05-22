using Mapster;
using Model = Pims.Api.Areas.Project.Models.Dispose;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectPropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectProperty, Model.ProjectPropertyModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.PropertyType, src => src.PropertyType)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectPropertyModel, Entity.ProjectProperty>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.PropertyType, src => src.PropertyType)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
