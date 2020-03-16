using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class LookupProfile : Profile
    {
        #region Constructors
        public LookupProfile()
        {
            CreateMap<Entity.LookupEntity, CodeModel>()
                .IncludeBase<Entity.BaseEntity, BaseModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.GetType().Name))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
                .IncludeAllDerived();

            CreateMap<CodeModel, Entity.LookupEntity>()
                .IncludeBase<BaseModel, Entity.BaseEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
