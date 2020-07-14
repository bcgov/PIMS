using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Mapping.User
{
    public class AccessRequestRoleMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequestRole, Model.AccessRequestRoleModel>()
                .Map(dest => dest.Id, src => src.RoleId)
                .Map(dest => dest.Description, src => src.Role.Description)
                .Map(dest => dest.Name, src => src.Role.Name)
                .Map(dest => dest.IsDisabled, src => src.Role.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Role.SortOrder)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .Map(dest => dest.RoleId, src => src.Id)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
