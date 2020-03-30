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
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom<Resolvers.KeycloakDisplayNameResolver>())
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.EmailVerified, opt => opt.MapFrom(src => src.EmailVerified))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.MiddleName, opt => opt.Ignore())
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Position, opt => opt.Ignore())
                .ForMember(dest => dest.Note, opt => opt.Ignore())
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AttributeMapToAgencyResolver>());

            CreateMap<Entity.User, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled))
                .ForMember(dest => dest.Attributes, opt => opt.Ignore())
                .ForMember(dest => dest.Groups, opt => opt.MapFrom<Resolvers.EntityRoleResolver>());

            CreateMap<Entity.User, Model.UserModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.EmailVerified, opt => opt.MapFrom(src => src.EmailVerified))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.MiddleName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.IsDisabled))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom<Resolvers.UserRoleToRoleResolver>())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AgencyToAgencyResolver>())
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<Model.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
            CreateMap<KModel.UserModel, Model.UserModel>()
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled));

            // Update models
            CreateMap<Model.Update.UserModel, Entity.User>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.EmailVerified, opt => opt.MapFrom(src => src.EmailVerified))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.MiddleName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Position, opt => opt.MapFrom(src => src.Position))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.IsDisabled))
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.UpdateAgencyToEntityResolver>())
                .ForMember(dest => dest.Roles, opt => opt.MapFrom<Resolvers.UpdateRoleToEntityResolver>())
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
        }
        #endregion
    }
}
