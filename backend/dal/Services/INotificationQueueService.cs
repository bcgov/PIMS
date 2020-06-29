using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// INotificationQueueService interface, provides functions to interact with the notification queue within the datasource.
    /// </summary>
    public interface INotificationQueueService : IService
    {
        Paged<NotificationQueue> GetPage(NotificationQueueFilter filter);
        NotificationQueue Get(int id);
        void Add(IEnumerable<NotificationQueue> notifications);
        void Add(NotificationQueue notification);
        IEnumerable<NotificationQueue> GenerateNotifications(Project project, int? fromStatusId, int? toStatusId);
        IEnumerable<NotificationQueue> GenerateNotifications(Project project, int projectStatusNotificationId);
        IEnumerable<NotificationQueue> GenerateNotifications(Project project, ProjectStatusNotification options, DateTime? sendOn = null);
        System.Threading.Tasks.Task<NotificationQueue> UpdateStatusAsync(int id);
        System.Threading.Tasks.Task SendNotificationsAsync(IEnumerable<NotificationQueue> notifications);
    }
}
