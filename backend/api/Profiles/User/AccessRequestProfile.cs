using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;
using System;

namespace Pims.Api.Profiles.User
{
    public class AccessRequestProfile : Profile
    {
        #region Constructors
        public AccessRequestProfile()
        {
            CreateMap<Entity.AccessRequest, Model.AccessRequestModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.User, opt => opt.MapFrom((s, d, m, c) =>
                {
                    if (s.User == null && s.UserId.HasValue) return new Model.AccessRequestUserModel() { Id = s.UserId.Value };

                    return c.Mapper.Map<Model.AccessRequestUserModel>(s.User);
                }));

            CreateMap<Model.AccessRequestModel, Entity.AccessRequest>()
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles));

            // User
            CreateMap<Entity.User, Model.AccessRequestUserModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.MiddleName, opt => opt.MapFrom(src => src.MiddleName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();

            // Agency
            CreateMap<Model.AgencyModel, Entity.AccessRequestAgency>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AgencyId, opt => opt.MapFrom(src => Int32.Parse(src.Id)));

            // Role
            CreateMap<Model.AccessRequestRoleModel, Entity.AccessRequestRole>()
                .ForMember(dest => dest.AccessRequest, opt => opt.Ignore())
                .ForMember(dest => dest.AccessRequestId, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<Entity.AccessRequestRole, Model.AccessRequestRoleModel>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Role.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Role.Description))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.RoleId));

            CreateMap<Model.AccessRequestRoleModel, Entity.Role>()
                .IncludeBase<Pims.Api.Models.CodeModel, Entity.LookupEntity>();

            CreateMap<Entity.Role, Model.AccessRequestRoleModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .IncludeBase<Entity.LookupEntity, Pims.Api.Models.CodeModel>();
        }
        #endregion
    }
}
