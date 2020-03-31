using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;
using System.Linq;
using System;

namespace Pims.Api.Areas.Keycloak.Profiles.User
{
    public class AccessRequestProfile : Profile
    {
        #region Constructors
        public AccessRequestProfile()
        {
            CreateMap<Entity.AccessRequest, Entity.AccessRequest>()
                .IncludeBase<Entity.BaseEntity, Entity.BaseEntity>();

            CreateMap<Entity.AccessRequest, Model.AccessRequestModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies.Select(a => a.Agency)))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(r => r.Role)))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));

            CreateMap<Model.AccessRequestModel, Entity.AccessRequest>()
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id));

            CreateMap<Model.AgencyModel, Entity.AccessRequestAgency>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => Int32.Parse(src.Id)));
            CreateMap<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<Entity.User, Model.AccessRequestUserModel>();
            CreateMap<Model.AccessRequestUserModel, Entity.User>();
            CreateMap<Model.AccessRequestRoleModel, Entity.Role>()
                .IncludeBase<Pims.Api.Models.CodeModel, Entity.LookupEntity>();
            CreateMap<Entity.Role, Model.AccessRequestRoleModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .IncludeBase<Entity.LookupEntity, Pims.Api.Models.CodeModel>();
        }
        #endregion
    }
}
