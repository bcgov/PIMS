using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class ProjectAgencyResponseMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectAgencyResponse, Model.ProjectAgencyResponseModel>()
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.AgencyCode, src => src.Agency.Code)
                .Map(dest => dest.ReceivedOn, src => src.ReceivedOn)
                .Map(dest => dest.Response, src => src.Response)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
