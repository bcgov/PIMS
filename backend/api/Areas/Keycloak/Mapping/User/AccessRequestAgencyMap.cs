using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Mapping.User
{
    public class AccessRequestAgencyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequestAgency, Model.AccessRequestAgencyModel>()
                .Map(dest => dest.Id, src => src.AgencyId)
                .Map(dest => dest.Description, src => src.Agency == null ? null : src.Agency.Description)
                .Map(dest => dest.Name, src => src.Agency == null ? null : src.Agency.Name)
                .Map(dest => dest.IsDisabled, src => src.Agency == null ? false : src.Agency.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Agency == null ? 0 : src.Agency.SortOrder)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.AccessRequestAgencyModel, Entity.AccessRequestAgency>()
                .Map(dest => dest.AgencyId, src => src.Id)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
