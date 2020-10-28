using Mapster;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Lookup
{
    public class CodeMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Agency, Models.CodeModel<int>>()
                .Map(dest => dest.Code, src => src.Code)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Inherits<Entity.LookupEntity<int>, Models.LookupModel<int>>();

            config.NewConfig<Entity.AdministrativeArea, Models.CodeModel<int>>()
                .Map(dest => dest.Code, src => src.Abbreviation)
                .Inherits<Entity.LookupEntity<int>, Models.LookupModel<int>>();
        }
    }
}
