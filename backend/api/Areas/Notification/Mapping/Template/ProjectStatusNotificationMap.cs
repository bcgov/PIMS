using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Notification.Models.Template;

namespace Pims.Api.Areas.Project.Mapping.Template
{
    public class ProjectStatusNotificationMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectStatusNotification, Model.ProjectStatusNotificationModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.FromStatusId, src => src.FromStatusId)
                .Map(dest => dest.FromStatus, src => src.FromStatus != null ? src.FromStatus.Name : null)
                .Map(dest => dest.ToStatusId, src => src.ToStatusId)
                .Map(dest => dest.ToStatus, src => src.ToStatus != null ? src.ToStatus.Name : null)
                .Map(dest => dest.Priority, src => src.Priority)
                .Map(dest => dest.Delay, src => src.Delay)
                .Map(dest => dest.DelayDays, src => src.DelayDays);

            config.NewConfig<Model.ProjectStatusNotificationModel, Entity.ProjectStatusNotification>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.FromStatusId, src => src.FromStatusId)
                .Map(dest => dest.ToStatusId, src => src.ToStatusId)
                .Map(dest => dest.Priority, src => src.Priority)
                .Map(dest => dest.Delay, src => src.Delay)
                .Map(dest => dest.DelayDays, src => src.DelayDays);
        }
    }
}
