using Mapster;
using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping
{
    public class CodeMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.CodeEntity<int>, Models.CodeModel<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Entity.LookupEntity<int>, Models.LookupModel<int>>();

            config.NewConfig<Models.CodeModel<int>, Entity.CodeEntity<int>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Models.LookupModel<int>, Entity.LookupEntity<int>>();


            config.NewConfig<Entity.CodeEntity<string>, Models.CodeModel<string>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Entity.LookupEntity<string>, Models.LookupModel<string>>();

            config.NewConfig<Models.CodeModel<string>, Entity.CodeEntity<string>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Models.LookupModel<string>, Entity.LookupEntity<string>>();


            config.NewConfig<Entity.CodeEntity<Guid>, Models.CodeModel<Guid>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Entity.LookupEntity<Guid>, Models.LookupModel<Guid>>();

            config.NewConfig<Models.CodeModel<Guid>, Entity.CodeEntity<Guid>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Models.LookupModel<Guid>, Entity.LookupEntity<Guid>>();


            config.NewConfig<Entity.CodeEntity<object>, Models.CodeModel<object>>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Code, src => src.Code)
                .Inherits<Entity.LookupEntity<object>, Models.LookupModel<object>>();
        }
    }
}
