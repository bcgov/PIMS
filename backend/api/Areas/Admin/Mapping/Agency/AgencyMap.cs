using Mapster;
using Model = Pims.Api.Areas.Admin.Models.Agency;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Admin.Mapping.Agency
{
    public class AgencyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Agency, Model.AgencyModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();

            config.NewConfig<Model.AgencyModel, Entity.Agency>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Inherits<Api.Models.CodeModel<int>, Entity.CodeEntity<int>>();
        }
    }
}
