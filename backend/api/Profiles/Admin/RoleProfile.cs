using System;
using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles.Admin
{
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<Entity.Role, Model.RoleModel>()
                .IncludeBase<Entity.LookupEntity, CodeModel>();

            CreateMap<Model.RoleModel, Entity.Role>();
        }
        #endregion
    }
}
