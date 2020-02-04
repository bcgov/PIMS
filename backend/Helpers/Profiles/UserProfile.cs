using System;
using AutoMapper;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles
{
    public class UserProfile : Profile
    {
        #region Constructors
        public UserProfile()
        {
            CreateMap<Entity.User, Model.UserModel>();

            CreateMap<Model.UserModel, Entity.User>();
        }
        #endregion
    }
}
