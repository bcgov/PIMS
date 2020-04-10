using Mapster;
using Model = Pims.Api.Models.User;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Mapping.User
{
    public class RoleMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Entity.LookupEntity<Guid>, Models.LookupModel<Guid>>();


            config.NewConfig<Model.RoleModel, Entity.Role>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
