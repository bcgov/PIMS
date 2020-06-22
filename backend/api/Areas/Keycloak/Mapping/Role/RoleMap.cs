using Mapster;
using KModel = Pims.Keycloak.Models;
using Model = Pims.Api.Areas.Keycloak.Models.Role;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Admin.Keycloak.Role
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .Map(dest => dest.KeycloakGroupId, src => src.KeycloakGroupId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Entity.LookupEntity<Guid>, Api.Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Api.Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();

            config.NewConfig<KModel.GroupModel, Entity.Role>()
                .Map(dest => dest.KeycloakGroupId, src => src.Id)
                .Map(dest => dest.Name, src => src.Name);
        }
    }
}
