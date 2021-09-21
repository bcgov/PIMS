using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.AdministrativeArea;

namespace Pims.Api.Areas.Admin.Mapping.AdministrativeArea
{
    public class AdministrativeAreaMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AdministrativeArea, Model.AdministrativeAreaModel>()
                .Map(dest => dest.GroupName, src => src.GroupName)
                .Map(dest => dest.BoundaryType, src => src.BoundaryType)
                .Map(dest => dest.Abbreviation, src => src.Abbreviation)
                .Inherits<Entity.LookupEntity<int>, Api.Models.LookupModel<int>>();

            config.NewConfig<Model.AdministrativeAreaModel, Entity.AdministrativeArea>()
                .Map(dest => dest.GroupName, src => src.GroupName)
                .Map(dest => dest.BoundaryType, src => src.BoundaryType)
                .Map(dest => dest.Abbreviation, src => src.Abbreviation)
                .Inherits<Api.Models.LookupModel<int>, Entity.LookupEntity<int>>();
        }
    }
}
