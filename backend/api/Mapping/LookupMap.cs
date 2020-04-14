using Mapster;
using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping
{
    public class LookupMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.LookupEntity<int>, Models.LookupModel<int>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Models.LookupModel<int>, Entity.LookupEntity<int>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.LookupEntity<string>, Models.LookupModel<string>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Models.LookupModel<string>, Entity.LookupEntity<string>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.LookupEntity<Guid>, Models.LookupModel<Guid>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.LookupEntity<object>, Models.LookupModel<object>>()
                .Map(dest => dest.Id, src => src.Id.ToString())
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
