using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

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
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.ReceivedOn, src => src.ReceivedOn)
                .Map(dest => dest.OfferAmount, src => src.OfferAmount)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectAgencyResponse, Entity.ProjectAgencyResponse>()
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.NotificationId, src => src.NotificationId)
                .Map(dest => dest.Response, src => src.Response)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.ReceivedOn, src => src.ReceivedOn)
                .Map(dest => dest.OfferAmount, src => src.OfferAmount)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
