using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Mapping.User
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Entity.LookupEntity<Guid>, Api.Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Api.Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
