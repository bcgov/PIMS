using AutoMapper;
using Pims.Api.Models;
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
                .ForMember(src => src.Id, opt => opt.MapFrom(dest => dest.Id.ToString()))
                .ForMember(src => src.Users, opt => opt.MapFrom(src => src.Users.Select(u => u.User)));

            CreateMap<Entity.Role, CodeModel>()
                .IncludeBase<Entity.LookupEntity, CodeModel>()
                .ForMember(src => src.Id, opt => opt.MapFrom(dest => dest.Id.ToString()))
                .ForMember(src => src.Code, opt => opt.MapFrom(dest => dest.Name));

            CreateMap<RoleModel, Entity.Role>()
                .ForMember(src => src.Id, opt => opt.MapFrom(dest => Guid.Parse(dest.Id)))
                .IncludeBase<CodeModel, Entity.LookupEntity>();
        }
        #endregion
    }
}
