using AutoMapper;
using Model = Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles
{
    public class CodeProfile : Profile
    {
        #region Constructors
        public CodeProfile()
        {
            CreateMap<Entity.CodeEntity, Model.CodeModel>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.GetType().Name))
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>()
                .IncludeAllDerived();

            CreateMap<Model.CodeModel, Entity.CodeEntity>()
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
