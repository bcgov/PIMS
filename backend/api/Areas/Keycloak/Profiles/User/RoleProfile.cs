using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.User
{
    /// <summary>
    /// RoleProfile class, provides automapper configuration for groups.
    /// </summary>
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<Entity.Role, Entity.Role>()
                .IncludeBase<Entity.BaseEntity, Entity.BaseEntity>();

            CreateMap<KModel.RoleModel, Entity.Role>();

            CreateMap<Entity.Role, Model.RoleModel>()
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<KModel.RoleModel, Model.RoleModel>();
            CreateMap<Model.RoleModel, KModel.RoleModel>();

            // Update models
            CreateMap<Model.Update.RoleModel, Entity.Role>()
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.RoleModel, KModel.RoleModel>();
        }
        #endregion
    }
}
