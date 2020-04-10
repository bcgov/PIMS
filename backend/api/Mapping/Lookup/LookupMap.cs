using Mapster;
using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Lookup
{
    public class LookupMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Province, Models.LookupModel<string>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Entity.Role, Models.LookupModel<Guid>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.PropertyType, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.PropertyStatus, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.PropertyClassification, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.BuildingConstructionType, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.BuildingOccupantType, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Entity.BuildingPredominateUse, Models.LookupModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Type, src => src.GetType().Name)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();
        }
    }
}
