using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using System.Linq;
using System;
using Pims.Api.Models.Parts;

namespace Pims.Api.Helpers.Profiles
{
    public class AccessRequestProfile : Profile
    {
        #region Constructors
        public AccessRequestProfile()
        {
            CreateMap<Entity.AccessRequest, AccessRequestModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies.Select(a => a.Agency)))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.Role)))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<AccessRequestModel, Entity.AccessRequest>()
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id));

            CreateMap<AgencyModel, Entity.AccessRequestAgency>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => Int32.Parse(src.Id)));
            CreateMap<AccessRequestRoleModel, Entity.AccessRequestRole>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<Entity.User, AccessRequestUserModel>();
            CreateMap<AccessRequestUserModel, Entity.User>();
            CreateMap<AccessRequestRoleModel, Entity.Role>()
                .IncludeBase<CodeModel, Entity.LookupEntity>();
            CreateMap<Entity.Role, AccessRequestRoleModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .IncludeBase<Entity.LookupEntity, CodeModel>();
        }
        #endregion
    }
}
