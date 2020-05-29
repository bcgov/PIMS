using Mapster;
using Model = Pims.Api.Areas.Project.Models.Dispose;
using ParcelModel = Pims.Api.Models.Parcel;
using Entity = Pims.Dal.Entities;
using Pims.Dal.Entities;
using System.Linq;
using System;
using Pims.Api.Helpers.Extensions;

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
                .Map(dest => dest.Parcel, src => src.Parcel)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.Building, src => src.Building)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectPropertyModel, Entity.ProjectProperty>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.PropertyType, src => src.PropertyType)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Parcel, src => src.Parcel)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.Building, src => src.Building)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
