using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Notification.Models.Template;

namespace Pims.Api.Areas.Project.Mapping.Template
{
    public class NotificationTemplateMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.NotificationTemplate, Model.NotificationTemplateModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.Audience, src => src.Audience)
                .Map(dest => dest.To, src => src.To)
                .Map(dest => dest.Cc, src => src.Cc)
                .Map(dest => dest.Bcc, src => src.Bcc)
                .Map(dest => dest.Priority, src => src.Priority)
                .Map(dest => dest.Encoding, src => src.Encoding)
                .Map(dest => dest.Subject, src => src.Subject)
                .Map(dest => dest.Body, src => src.Body)
                .Map(dest => dest.BodyType, src => src.BodyType)
                .Map(dest => dest.Tag, src => src.Tag)
                .Map(dest => dest.Status, src => src.Status)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.NotificationTemplateModel, Entity.NotificationTemplate>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.Audience, src => src.Audience)
                .Map(dest => dest.To, src => src.To)
                .Map(dest => dest.Cc, src => src.Cc)
                .Map(dest => dest.Bcc, src => src.Bcc)
                .Map(dest => dest.Priority, src => src.Priority)
                .Map(dest => dest.Encoding, src => src.Encoding)
                .Map(dest => dest.Subject, src => src.Subject)
                .Map(dest => dest.Body, src => src.Body)
                .Map(dest => dest.BodyType, src => src.BodyType)
                .Map(dest => dest.Tag, src => src.Tag)
                .Map(dest => dest.Status, src => src.Status)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
