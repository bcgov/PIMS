using Mapster;
using Model = Pims.Api.Areas.Project.Models.Dispose;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectAgencyResponseMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectAgencyResponse, Model.ProjectAgencyResponse>()
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.AgencyCode, src => src.Agency.Name)
                .Map(dest => dest.NotificationId, src => src.NotificationId)
                .Map(dest => dest.Response, src => src.Response)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectAgencyResponse, Entity.ProjectAgencyResponse>()
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.NotificationId, src => src.NotificationId)
                .Map(dest => dest.Response, src => src.Response)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
