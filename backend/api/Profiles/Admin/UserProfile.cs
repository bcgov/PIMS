using System;
using AutoMapper;
using Pims.Api.Models;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles.Admin
{
    public class UserProfile : Profile
    {
        #region Constructors
        public UserProfile()
        {
            CreateMap<Entity.User, Model.UserModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies.Select(a => a.Agency)))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(a => a.Role)));

            CreateMap<Model.UserModel, Entity.User>()
                .ForMember(dest => dest.IsDisabled, opt => opt.Ignore());

            CreateMap<Model.RoleModel, Entity.UserRole>()
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Id));
        }
        #endregion
    }
}
