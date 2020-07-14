using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Mapping.User
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


            config.NewConfig<Entity.UserAgency, Model.AgencyModel>()
                .Map(dest => dest.Id, src => src.AgencyId);

            config.NewConfig<Model.AgencyModel, Entity.UserAgency>()
                .Map(dest => dest.AgencyId, src => src.Id);
        }
    }
}
