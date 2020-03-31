using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.Role;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Role
{
    /// <summary>
    /// RoleProfile class, provides automapper configuration for groups.
    /// </summary>
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<KModel.GroupModel, Entity.Role>();

            CreateMap<Entity.Role, Model.RoleModel>()
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<KModel.GroupModel, Model.RoleModel>();
            CreateMap<Model.RoleModel, KModel.GroupModel>();
        }
        #endregion
    }
}
