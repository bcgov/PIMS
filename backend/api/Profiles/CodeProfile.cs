using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class CodeProfile : Profile
    {
        #region Constructors
        public CodeProfile()
        {
            CreateMap<Entity.CodeEntity, CodeModel>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.GetType().Name))
                .IncludeBase<Entity.BaseEntity, BaseModel>()
                .IncludeAllDerived();

            CreateMap<CodeModel, Entity.CodeEntity>()
                .IncludeBase<BaseModel, Entity.BaseEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
