using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Notification.Models.Queue;

namespace Pims.Api.Areas.Project.Mapping.Queue
{
    public class NotificationQueueMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.NotificationQueue, Model.NotificationQueueModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.Priority, src => src.Priority)
                .Map(dest => dest.Encoding, src => src.Encoding)
                .Map(dest => dest.To, src => src.To)
                .Map(dest => dest.Cc, src => src.Cc)
                .Map(dest => dest.Bcc, src => src.Bcc)
                .Map(dest => dest.Subject, src => src.Subject)
                .Map(dest => dest.Body, src => src.Body)
                .Map(dest => dest.BodyType, src => src.BodyType)
                .Map(dest => dest.Tag, src => src.Tag)
                .Map(dest => dest.SendOn, src => src.SendOn)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.ToAgencyId, src => src.ToAgencyId)
                .Map(dest => dest.ChesTransactionId, src => src.ChesTransactionId)
                .Map(dest => dest.ChesMessageId, src => src.ChesMessageId)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
