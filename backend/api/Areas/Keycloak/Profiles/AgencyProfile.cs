using AutoMapper;
using Pims.Api.Profiles.Extensions;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles
{
    /// <summary>
    /// AgencyProfile class, provides automapper configuration for agencies.
    /// </summary>
    public class AgencyProfile : Profile
    {
        #region Constructors
        public AgencyProfile()
        {
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
