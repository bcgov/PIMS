using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;
using Pims.Api.Helpers.Extensions;
using System;
using System.Linq;

namespace Pims.Api.Profiles.User
{
    public class RoleProfile : Profile
    {
        #region Constructors
        public RoleProfile()
        {
            CreateMap<Entity.Role, Model.RoleModel>()
                .IncludeBase<Entity.LookupEntity, Pims.Api.Models.CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.Users.Select(u => u.User)));

            CreateMap<Entity.Role, Pims.Api.Models.CodeModel>()
                .IncludeBase<Entity.LookupEntity, Pims.Api.Models.CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name));

            CreateMap<Model.RoleModel, Entity.Role>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)))
                .IncludeBase<Pims.Api.Models.CodeModel, Entity.LookupEntity>();

            CreateMap<Entity.UserRole, Model.RoleModel>()
                .IgnoreAllUnmapped()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.Code, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Role.Description))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.Role.IsDisabled))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();
        }
        #endregion
    }
}
