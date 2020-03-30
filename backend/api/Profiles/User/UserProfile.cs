using AutoMapper;
using Model = Pims.Api.Models.User;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.User
{
    public class UserProfile : Profile
    {
        #region Constructors
        public UserProfile()
        {
            CreateMap<Entity.User, Model.UserModel>()
                .ForMember(dest => dest.Agencies, opt => opt.MapFrom(src => src.Agencies))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles));

            CreateMap<Model.UserModel, Entity.User>()
                .ForMember(dest => dest.Agencies, opt => opt.Ignore())
                .ForMember(dest => dest.Roles, opt => opt.Ignore());
        }
        #endregion
    }
}
