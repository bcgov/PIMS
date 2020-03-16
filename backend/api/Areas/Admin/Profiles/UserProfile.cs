using AutoMapper;
using Pims.Api.Profiles.Extensions;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Areas.Admin.Profiles
{
    /// <summary>
    /// UserProfile class, provides a way to configure automapper to convert users.
    /// </summary>
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
        }
        #endregion
    }
}
