using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.User
{
    /// <summary>
    /// UpdateUserProfile class, provides automapper configuration for users.
    /// </summary>
    public class UpdateUserProfile : Profile
    {
        #region Constructors
        public UpdateUserProfile()
        {
            CreateMap<Model.Update.UserModel, Entity.User>()
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
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles))
                .IncludeBase<Model.Update.BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.User, Model.Update.UserModel>()
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
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles))
                .IncludeBase<Entity.BaseEntity, Model.Update.BaseModel>();

            CreateMap<Model.Update.UserModel, KModel.UserModel>()
                .ForMember(dest => dest.Enabled, opt => opt.MapFrom(src => !src.IsDisabled));

            // UserRole
            CreateMap<Entity.UserRole, Model.Update.UserRoleModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<Model.Update.UserRoleModel, Entity.UserRole>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Id));

            // UserAgency
            CreateMap<Entity.UserAgency, Model.Update.UserAgencyModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Agency.Name));

            CreateMap<Model.Update.UserAgencyModel, Entity.UserAgency>()
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => src.Id));
        }
        #endregion
    }
}
