using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Lookup;

namespace Pims.Api.Mapping.Lookup
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Entity.LookupEntity<Guid>, Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
