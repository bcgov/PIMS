using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Mapping.User
{
    public class AgencyMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Agency, Model.AgencyModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();


            config.NewConfig<Model.AgencyModel, Entity.Agency>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Inherits<Api.Models.CodeModel<int>, Entity.CodeEntity<int>>();
        }
    }
}
