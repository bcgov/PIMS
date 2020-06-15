using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Models;
using Pims.Dal.Security;
using Pims.Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// NotificationQueueService class, provides a service layer to interact with notification templates within the datasource.
    /// </summary>
    public class NotificationQueueService : BaseService<NotificationQueue>, INotificationQueueService
    {
        #region Variables
        private readonly INotificationService _notifyService;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a NotificationQueueService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="notifyService"></param>
        /// <param name="logger"></param>
        public NotificationQueueService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, INotificationService notifyService, ILogger<TaskService> logger) : base(dbContext, user, service, logger)
        {
            _notifyService = notifyService;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get the notification in the queue for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">The notification does not exist in the queue for the specified 'id'.</exception>
        /// <returns></returns>
        public NotificationQueue Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            return this.Context.NotificationQueue
                .FirstOrDefault(t => t.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add the specified 'notification' to the data source.
        /// </summary>
        /// <param name="notification"></param>
        public void Add(NotificationQueue notification)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            this.Context.NotificationQueue.Add(notification);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Add the array of notifications to the data source.
        /// </summary>
        /// <param name="notifications"></param>
        public void Add(IEnumerable<NotificationQueue> notifications)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            this.Context.NotificationQueue.AddRange(notifications);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Updates the status for the notification in the queue specified for the 'id', with the status of the message in CHES.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async System.Threading.Tasks.Task<NotificationQueue> UpdateStatusAsync(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            var notification = this.Context.NotificationQueue.Find(id) ?? throw new KeyNotFoundException();

            if (!notification.Status.In(NotificationStatus.Completed, NotificationStatus.Cancelled) && notification.ChesMessageId.HasValue)
            {
                var response = await _notifyService.GetStatusAsync(notification.ChesMessageId.Value);
                notification.Status = (NotificationStatus)Enum.Parse(typeof(NotificationStatus), response.Status, true);

                this.Context.CommitTransaction();
            }

            return notification;
        }

        /// <summary>
        /// Generate an array of notifications for the specified 'project', and for the specified 'fromStatusId' and 'toStatusId'.
        /// This will generate all notifications that should be generated for the specified status transition,
        /// along with any notifications that are only specifically for the 'toStatusId'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="fromStatusId"></param>
        /// <param name="toStatusId"></param>
        /// <returns></returns>
        public IEnumerable<NotificationQueue> GenerateNotifications(Project project, int? fromStatusId, int? toStatusId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            if (project == null) throw new ArgumentNullException(nameof(project));

            var options = this.Context.ProjectStatusNotifications
                .AsNoTracking()
                .Include(n => n.Template)
                .Where(n => !n.Template.IsDisabled && n.FromStatusId == fromStatusId && n.ToStatusId == toStatusId);

            // Remove any notifications that have already been sent.
            var templateIds = options.Select(o => o.TemplateId).Distinct().ToArray();
            var sendIds = templateIds.Except(this.Context.NotificationQueue.Where(n => n.ProjectId == project.Id && n.TemplateId != null && templateIds.Contains((int)n.TemplateId)).Select(n => (int)n.TemplateId).ToArray());

            var queue = new List<NotificationQueue>();
            foreach (var o in options.Where(o => sendIds.Contains(o.TemplateId)))
            {
                queue.AddRange(GenerateNotifications(project, o));
            }
            return queue;
        }

        /// <summary>
        /// Generate an array of notifications for the specified 'project', and for the specified 'projectStatusNotificationId'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="projectStatusNotificationId"></param>
        /// <returns></returns>
        public IEnumerable<NotificationQueue> GenerateNotifications(Project project, int projectStatusNotificationId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            return GenerateNotifications(project, this.Self.ProjectNotification.Get(projectStatusNotificationId));
        }

        /// <summary>
        /// Generate an array of notifications for the specified 'project', and for the specified 'options' that represent the status transitions.
        /// If any notifications have a delay that expects a given date, use the specified 'sendOn' date.
        /// Depending on the notification template audience a number of notifications will be generated.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="options"></param>
        /// <param name="sendOn"></param>
        /// <returns></returns>
        public IEnumerable<NotificationQueue> GenerateNotifications(Project project, ProjectStatusNotification options, DateTime? sendOn = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            if (project == null) throw new ArgumentNullException(nameof(project));
            if (options == null) throw new ArgumentNullException(nameof(options));
            if (options.Template == null) throw new ArgumentNullException(nameof(options), "Argument property 'Template' is cannot be null.");

            var notifications = new List<NotificationQueue>();
            if (options.Template.Audience == NotificationAudiences.OwningAgency)
            {
                // Generate a notification for the owning agency of the project.
                notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), project, project.Agency), sendOn));
            }
            else if (options.Template.Audience == NotificationAudiences.Agencies)
            {
                // Generate a notification for all enabled agencies that have not turned of emails, or indicated they are not interested in the project.
                var agencies = from a in this.Context.Agencies
                               join par in this.Context.ProjectAgencyResponses on new { AgencyId = a.Id, ProjectId = project.Id } equals new { par.AgencyId, par.ProjectId } into g
                               from n in g.DefaultIfEmpty()
                               where !a.IsDisabled && a.SendEmail && (n == null || n.Response != NotificationResponses.Ignore)
                               select a;

                foreach (var agency in agencies)
                {
                    notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), project, agency), sendOn));
                }
            }
            else if (options.Template.Audience == NotificationAudiences.ParentAgencies)
            {
                // Generate a notification for all enabled parent agencies that have not turned of emails.
                var agencies = this.Context.Agencies.Where(a => a.ParentId == null && !a.IsDisabled && a.SendEmail);

                foreach (var agency in agencies)
                {
                    notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), project, agency), sendOn));
                }
            }
            else if (options.Template.Audience == NotificationAudiences.Default)
            {
                // Generate a notification for the default specified 'To' email addresses.
                notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), project), sendOn));
            }

            return notifications;
        }

        /// <summary>
        /// Send the notifications to CHES.
        /// Update the queue with the latest information.
        /// </summary>
        /// <param name="notifications"></param>
        /// <returns></returns>
        public async System.Threading.Tasks.Task SendNotificationsAsync(IEnumerable<NotificationQueue> notifications)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            if (notifications == null) throw new ArgumentNullException(nameof(notifications));

            foreach (var notification in notifications)
            {
                if (this.Context.Entry(notification).State == EntityState.Detached) this.Context.NotificationQueue.Add(notification);
                try
                {
                    // Send notifications to CHES.
                    var messages = await _notifyService.SendNotificationAsync(new Notifications.Models.Email()
                    {
                        To = notification.To.Split(";"),
                        Cc = notification.Cc?.Split(";"),
                        Bcc = notification.Bcc?.Split(";"),
                        Encoding = (Notifications.Models.EmailEncodings)Enum.Parse(typeof(Notifications.Models.EmailEncodings), notification.Encoding.ToString()),
                        BodyType = (Notifications.Models.EmailBodyTypes)Enum.Parse(typeof(Notifications.Models.EmailBodyTypes), notification.BodyType.ToString()),
                        Priority = (Notifications.Models.EmailPriorities)Enum.Parse(typeof(Notifications.Models.EmailPriorities), notification.Priority.ToString()),
                        Subject = notification.Subject,
                        Body = notification.Body,
                        SendOn = notification.SendOn,
                        Tag = notification.Tag,
                    });
                    notification.ChesTransactionId = messages.TransactionId;
                    notification.ChesMessageId = messages.Messages.First().MessageId;
                }
                catch (Exception ex)
                {
                    notification.Status = NotificationStatus.Failed;
                    this.Logger.LogError(ex, $"Failed to send email to CHES - notification:{notification.Id}");
                }
            }

            // Update the notification queue to include the CHES references.
            if (notifications.Any()) this.Context.CommitTransaction();
        }
        #endregion

        #region Helpers
        /// <summary>
        /// Generate the notification for the specified `options` and `model`.
        /// Build the template and merge the model into the Subject and Body properties of the notification.
        /// Use the specified `sendOn` date if the notification template delay requires it.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="model"></param>
        /// <param name="sendOn"></param>
        /// <returns></returns>
        private NotificationQueue GenerateNotification(ProjectStatusNotification options, ProjectNotificationModel model, DateTime? sendOn = null)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (options == null) throw new ArgumentNullException(nameof(options));
            if (options.Template == null) throw new ArgumentNullException(nameof(options), "Argument property 'Template' is cannot be null.");

            var template = new Notifications.Models.EmailTemplate()
            {
                Subject = options.Template.Subject,
                BodyType = (Notifications.Models.EmailBodyTypes)Enum.Parse(typeof(Notifications.Models.EmailBodyTypes), options.Template.BodyType.ToString()),
                Body = options.Template.Body,
            };
            _notifyService.Build(options.TemplateId.ToString(), template, model);
            var now = DateTime.UtcNow;
            sendOn = options.Delay switch
            {
                NotificationDelays.Days => now.AddDays(options.DelayDays),
                NotificationDelays.EndOfDay => DateTime.Now.Date,
                NotificationDelays.EndOfMonth => new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month)).Date,
                NotificationDelays.SetDate => sendOn,
                _ => now
            };
            return new NotificationQueue(options.Template, model.Project, model.ToAgency, template.Subject, template.Body)
            {
                Key = model.NotificationKey,
                Status = NotificationStatus.Pending,
                Priority = options.Priority,
                SendOn = sendOn.Value,
                To = String.Join(";", new[] { model.ToAgency?.Email, options.Template.To }.NotNull()),
                Cc = options.Template.Cc,
                Bcc = options.Template.Bcc
            };
        }
        #endregion
    }
}
