using System;
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
                .IncludeAllDerived();

            CreateMap<CodeModel, Entity.CodeEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
