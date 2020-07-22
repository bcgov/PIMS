using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// INotificationService interface, provides functions to send notifications.
    /// </summary>
    public interface INotificationService
    {
        System.Threading.Tasks.Task SendAsync(NotificationQueue notification);
        System.Threading.Tasks.Task SendAsync(IEnumerable<NotificationQueue> notifications);
        System.Threading.Tasks.Task CancelAsync(NotificationQueue notificat);
        System.Threading.Tasks.Task CancelAsync(IEnumerable<NotificationQueue> notifications);
        void Generate<TModel>(NotificationQueue notification, TModel model);
    }
}
