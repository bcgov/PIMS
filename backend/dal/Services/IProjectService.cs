using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectService interface, provides functions to interact with projects within the datasource.
    /// </summary>
    public interface IProjectService : IService
    {
        int Count();
        Paged<Project> GetPage(ProjectFilter filter);
        Project Get(int id);
        Project Get(string projectNumber);
        Paged<NotificationQueue> GetNotificationsInQueue(ProjectNotificationFilter filter);
        Project Add(Project project);
        Project Update(Project project);
        System.Threading.Tasks.Task RemoveAsync(Project project);
        System.Threading.Tasks.Task<Project> SetStatusAsync(Project project, Workflow workflow);
        System.Threading.Tasks.Task<Project> SetStatusAsync(Project project, string workflowCode);
        System.Threading.Tasks.Task<Paged<NotificationQueue>> CancelNotificationsAsync(int id);
        System.Threading.Tasks.Task<Paged<NotificationQueue>> CancelNotificationsAsync(int id, int agencyId);
        System.Threading.Tasks.Task<IEnumerable<NotificationQueue>> GenerateWatchNotificationsAsync(IEnumerable<ProjectAgencyResponse> responses);
    }
}
