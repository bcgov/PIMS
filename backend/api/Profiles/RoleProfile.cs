using AutoMapper;
using Pims.Api.Models;
using Pims.Api.Profiles.Extensions;
using System;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<Entity.Role, RoleModel>()
                .IncludeBase<Entity.LookupEntity, CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.Users.Select(u => u.User)));

            CreateMap<Entity.Role, CodeModel>()
                .IncludeBase<Entity.LookupEntity, CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name));

            CreateMap<RoleModel, Entity.Role>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .IncludeBase<CodeModel, Entity.LookupEntity>();

            CreateMap<Entity.UserRole, RoleModel>()
                .IgnoreAllUnmapped()
                .IncludeBase<Entity.BaseEntity, BaseModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.Code, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Role.Description))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.Role.IsDisabled));
        }
        #endregion
    }
}
