using Mapster;
using Model = Pims.Api.Areas.Keycloak.Models.Role;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Admin.Keycloak.Role
{
    public class UpdateRoleMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.Update.RoleModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Inherits<Entity.BaseEntity, Model.Update.BaseModel>();


            config.NewConfig<Model.Update.RoleModel, Entity.Role>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Inherits<Model.Update.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.BaseEntity, Model.Update.BaseModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.ToBase64String(src.RowVersion));


            config.NewConfig<Model.Update.BaseModel, Entity.BaseEntity>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.FromBase64String(src.RowVersion));
        }
    }
}
