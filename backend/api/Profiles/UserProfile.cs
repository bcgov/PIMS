using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class UserProfile : Profile
    {
        #region Constructors
        public UserProfile()
        {
            CreateMap<Entity.User, UserModel>();

            CreateMap<UserModel, Entity.User>()
                .ForMember(src => src.Agencies, opt => opt.Ignore())
                .ForMember(src => src.Roles, opt => opt.Ignore());
        }
        #endregion
    }
}
