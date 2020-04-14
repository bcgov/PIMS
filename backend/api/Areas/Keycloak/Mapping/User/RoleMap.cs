using Mapster;
using Model = Pims.Api.Areas.Keycloak.Models.User;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Keycloak.Mapping.User
{
    public class RoleMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Inherits<Entity.LookupEntity<Guid>, Api.Models.LookupModel<Guid>>();


            config.NewConfig<Model.RoleModel, Entity.Role>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Inherits<Api.Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
