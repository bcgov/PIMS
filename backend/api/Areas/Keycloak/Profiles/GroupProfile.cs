using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;
using KModel = Pims.Keycloak.Models;
using Pims.Api.Profiles.Extensions;

namespace Pims.Api.Areas.Keycloak.Profiles
{
    /// <summary>
    /// GroupProfile class, provides automapper configuration for groups.
    /// </summary>
    public class GroupProfile : Profile
    {
        #region Constructors
        public GroupProfile()
        {
            CreateMap<KModel.GroupModel, Entity.Role>();

            CreateMap<Entity.Role, Model.GroupModel>()
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<KModel.GroupModel, Model.GroupModel>();
            CreateMap<Model.GroupModel, KModel.GroupModel>();

            // Update models
            CreateMap<Model.Update.GroupModel, Entity.Role>()
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.GroupModel, KModel.GroupModel>();
        }
        #endregion
    }
}
