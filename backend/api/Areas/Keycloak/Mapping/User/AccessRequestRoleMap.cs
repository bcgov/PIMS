using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Mapping.User
{
    public class AccessRequestRoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequestRole, Model.AccessRequestRoleModel>()
                .Map(dest => dest.Id, src => src.RoleId)
                .Map(dest => dest.Description, src => src.Role == null ? null : src.Role.Description)
                .Map(dest => dest.Name, src => src.Role == null ? null : src.Role.Name)
                .Map(dest => dest.IsDisabled, src => src.Role == null ? false : src.Role.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Role == null ? 0 : src.Role.SortOrder)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .Map(dest => dest.RoleId, src => src.Id)
                .Map(dest => dest.Role, src => new Entity.Role(src.Id, src.Name)
                {
                    Description = src.Description,
                    IsDisabled = src.IsDisabled,
                    SortOrder = src.SortOrder
                })
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
