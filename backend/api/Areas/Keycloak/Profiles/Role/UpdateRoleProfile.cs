using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.Role;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Role
{
    /// <summary>
    /// RoleProfile class, provides automapper configuration for groups.
    /// </summary>
    public class UpdateRoleProfile : Profile
    {
        #region Constructors
        public UpdateRoleProfile()
        {
            CreateMap<Entity.Role, Model.Update.RoleModel>()
                .IncludeBase<Entity.BaseEntity, Model.Update.BaseModel>();
            
            CreateMap<Model.Update.RoleModel, Entity.Role>()
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.RoleModel, KModel.RoleModel>();
        }
        #endregion
    }
}
