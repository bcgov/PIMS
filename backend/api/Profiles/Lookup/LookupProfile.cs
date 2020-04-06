using AutoMapper;
using Model = Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.Lookup
{
    public class LookupProfile : Profile
    {
        #region Constructors
        public LookupProfile()
        {
            CreateMap<Entity.LookupEntity, Model.CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.GetType().Name))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>()
                .IncludeAllDerived();

            CreateMap<Entity.Province, Model.CodeModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.GetType().Name))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Name))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>()
                .IncludeAllDerived();

            CreateMap<Model.CodeModel, Entity.LookupEntity>()
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
