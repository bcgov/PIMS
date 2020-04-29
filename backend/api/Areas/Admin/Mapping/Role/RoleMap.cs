using Mapster;
using Model = Pims.Api.Areas.Admin.Models.Role;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Admin.Mapping.Role
{
    public class RoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Role, Model.RoleModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Entity.LookupEntity<Guid>, Api.Models.LookupModel<Guid>>();

            config.NewConfig<Model.RoleModel, Entity.Role>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsPublic, src => src.IsPublic)
                .Inherits<Api.Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();
        }
    }
}
