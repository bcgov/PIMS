using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using System.Linq;
using System;

namespace Pims.Api.Helpers.Profiles
{
    public class AccessRequestProfile : Profile
    {
        #region Constructors
        public AccessRequestProfile()
        {
            CreateMap<Entity.AccessRequest, AccessRequestModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies.Select(a => a.Agency)))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.Role)));

            CreateMap<AccessRequestModel, Entity.AccessRequest>();

            CreateMap<AgencyModel, Entity.AccessRequestAgency>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => Int32.Parse(src.Id)));
            CreateMap<RoleModel, Entity.AccessRequestRole>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));
        }
        #endregion
    }
}
