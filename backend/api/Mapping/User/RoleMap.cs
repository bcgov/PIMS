using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Mapping.User
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Entity.LookupEntity<Guid>, Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
