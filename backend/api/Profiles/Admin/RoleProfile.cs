using System;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles.Admin
{
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<Entity.Role, Model.RoleModel>();

            CreateMap<Model.RoleModel, Entity.Role>();
        }
        #endregion
    }
}
