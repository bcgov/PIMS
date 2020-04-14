using Mapster;
using Model = Pims.Api.Models.User;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Mapping.User
{
    public class AccessRequestRoleMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequestRole, Model.AccessRequestRoleModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.RoleId.ToString())
                .Map(dest => dest.Description, src => src.Role.Description)
                .Map(dest => dest.Name, src => src.Role.Name)
                .Map(dest => dest.Code, src => src.Role.Name)
                .Map(dest => dest.IsDisabled, src => src.Role.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Role.SortOrder)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.AccessRequestId, src => Guid.NewGuid()) // TODO: Set this value if required.
                .Map(dest => dest.RoleId, src => src.Id)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
