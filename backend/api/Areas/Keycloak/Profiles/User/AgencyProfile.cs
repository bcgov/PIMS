using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Profiles.User
{
    /// <summary>
    /// AgencyProfile class, provides automapper configuration for agencies.
    /// </summary>
    public class AgencyProfile : Profile
    {
        #region Constructors
        public AgencyProfile()
        {
            CreateMap<Entity.Agency, Entity.Agency>()
                .IncludeBase<Entity.BaseEntity, Entity.BaseEntity>();

            CreateMap<Model.AgencyModel, Entity.Agency>()
                .IncludeBase<Api.Models.BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Agency, Model.AgencyModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .IncludeBase<Entity.BaseEntity, Api.Models.BaseModel>();
        }
        #endregion
    }
}
