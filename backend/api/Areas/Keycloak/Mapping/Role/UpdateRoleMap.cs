using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.Role;

namespace Pims.Api.Areas.Admin.Keycloak.Role
{
    public class UpdateRoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.Update.RoleModel>()
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Entity.BaseEntity, Model.Update.BaseModel>();

            config.NewConfig<Model.Update.RoleModel, Entity.Role>()
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Model.Update.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.BaseEntity, Model.Update.BaseModel>()
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.ToBase64String(src.RowVersion));

            config.NewConfig<Model.Update.BaseModel, Entity.BaseEntity>()
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.FromBase64String(src.RowVersion));
        }
    }
}
