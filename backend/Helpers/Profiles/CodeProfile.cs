using System;
using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Api.Data.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class CodeProfile : Profile
    {
        #region Constructors
        public CodeProfile()
        {
            CreateMap<Entity.CodeEntity, CodeModel>()
                .IncludeAllDerived();

            CreateMap<CodeModel, Entity.CodeEntity>()
                .IncludeAllDerived();
        }
        #endregion
    }
}
