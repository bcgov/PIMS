using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Mapping.User
{
    public class AccessRequestAgencyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequestAgency, Model.AccessRequestAgencyModel>()
                .Map(dest => dest.Id, src => src.AgencyId)
                .Map(dest => dest.Code, src => src.Agency.Code)
                .Map(dest => dest.Description, src => src.Agency.Description)
                .Map(dest => dest.Name, src => src.Agency.Name)
                .Map(dest => dest.IsDisabled, src => src.Agency.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Agency.SortOrder)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.AccessRequestAgencyModel, Entity.AccessRequestAgency>()
                .Map(dest => dest.AgencyId, src => src.Id)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
