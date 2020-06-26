using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Model = Pims.Notifications.Models;

namespace Pims.Notifications
{
    public interface INotificationService
    {
        void Build<TModel>(string templateKey, Model.IEmailTemplate template, TModel model);
        Task<Model.EmailResponse> SendNotificationAsync<TModel>(string templateKey, Model.IEmail email, TModel model);
        Task<Model.EmailResponse> SendNotificationAsync(Model.IEmail notification);
        Task<Model.EmailResponse> SendNotificationsAsync(IEnumerable<Model.IEmail> notifications);
        Task<Model.StatusResponse> GetStatusAsync(Guid messageId);
    }
}
