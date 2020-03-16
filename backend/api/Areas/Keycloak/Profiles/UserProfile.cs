using System.Data;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;
using KModel = Pims.Keycloak.Models;
using Pims.Api.Profiles.Extensions;

namespace Pims.Api.Areas.Keycloak.Profiles
{
    /// <summary>
    /// UserProfile class, provides automapper configuration for users.
    /// </summary>
    public class UserProfile : Profile
    {
        #region Constructors
        public UserProfile()
        {
            CreateMap<KModel.UserModel, Entity.User>()
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled))
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AttributeMapToAgencyResolver>());

            CreateMap<Entity.User, Model.UserModel>()
                .ForMember(dest => dest.Groups, opt => opt.MapFrom<Resolvers.UserRoleToGroupResolver>())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AgencyToAgencyResolver>())
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<Model.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
            CreateMap<KModel.UserModel, Model.UserModel>()
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled));

            // Update models
            CreateMap<Model.Update.UserModel, Entity.User>()
                .ForMember(dest => dest.Agencies, opt => opt.Ignore())
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
        }
        #endregion
    }
}
