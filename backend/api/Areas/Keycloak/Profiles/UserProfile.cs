using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;
using KModel = Pims.Keycloak.Models;

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
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.LastName}, {src.FirstName}"))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled))
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AttributeMapToAgencyResolver>());

            CreateMap<Entity.User, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled))
                .ForMember(dest => dest.Attributes, opt => opt.Ignore())
                .ForMember(dest => dest.Groups, opt => opt.MapFrom<Resolvers.EntityRoleResolver>());

            CreateMap<Entity.User, Model.UserModel>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom<Resolvers.UserRoleToRoleResolver>())
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.AgencyToAgencyResolver>())
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();

            CreateMap<Model.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
            CreateMap<KModel.UserModel, Model.UserModel>()
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => !src.Enabled));

            // Update models
            CreateMap<Model.Update.UserModel, Entity.User>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom<Resolvers.UpdateAgencyToEntityResolver>())
                .ForMember(dest => dest.Roles, opt => opt.MapFrom<Resolvers.UpdateRoleToEntityResolver>())
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Model.Update.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));
        }
        #endregion
    }
}
