using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Mapping.User
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
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.RoleId, src => src.Id)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
