using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Mapping.User
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Map(dest => dest.KeycloakGroupId, src => src.KeycloakGroupId)
                .Inherits<Entity.LookupEntity<Guid>, Api.Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Map(dest => dest.KeycloakGroupId, src => src.KeycloakGroupId)
                .Inherits<Api.Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();


            config.NewConfig<Entity.UserRole, Model.RoleModel>()
                .Map(dest => dest.Id, src => src.RoleId);

            config.NewConfig<Model.RoleModel, Entity.UserRole>()
                .Map(dest => dest.RoleId, src => src.Id);
        }
    }
}
