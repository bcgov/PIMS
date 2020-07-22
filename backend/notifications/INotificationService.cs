using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Model = Pims.Notifications.Models;

namespace Pims.Notifications
{
    public interface INotificationService : Dal.Services.INotificationService
    {
        void Build<TModel>(string templateKey, Model.IEmailTemplate template, TModel model);
        Task<Model.EmailResponse> SendAsync<TModel>(string templateKey, Model.IEmail email, TModel model);
        Task<Model.EmailResponse> SendAsync(Model.IEmail notification);
        Task<Model.EmailResponse> SendAsync(IEnumerable<Model.IEmail> notifications);
        Task<Model.StatusResponse> GetStatusAsync(Guid messageId);
        Task<Model.StatusResponse> CancelAsync(Guid messageId);
    }
}
