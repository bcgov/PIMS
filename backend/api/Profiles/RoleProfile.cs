using AutoMapper;
using Pims.Api.Models;
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
                .IncludeBase<Entity.BaseEntity, BaseModel>()
                .ForMember(src => src.Users, opt => opt.MapFrom(src => src.Users.Select(u => u.User)));

            CreateMap<RoleModel, Entity.Role>();
        }
        #endregion
    }
}
