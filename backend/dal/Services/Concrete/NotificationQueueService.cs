using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
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
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a NotificationQueueService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="options"></param>
        /// <param name="service"></param>
        /// <param name="notifyService"></param>
        /// <param name="logger"></param>
        public NotificationQueueService(PimsContext dbContext, ClaimsPrincipal user, IOptions<PimsOptions> options, IPimsService service, INotificationService notifyService, ILogger<TaskService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
            _notifyService = notifyService;
        }
        #endregion

        #region Methods

        /// <summary>
        /// Get an array of notifications within the specified filter.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<NotificationQueue> GetPage(NotificationQueueFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            var query = this.Context.GenerateQuery(this.User, filter);
            var total = query.Count();
            var items = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);

            return new Paged<NotificationQueue>(items, filter.Page, filter.Quantity, total);
        }

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
        /// Update the speicified 'notification' in the data source.
        /// </summary>
        /// <param name="notification"></param>
        public void Update(NotificationQueue notification)
        {
            this.Context.Update(notification);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Update the speicified 'notifications' in the data source.
        /// </summary>
        /// <param name="notifications"></param>
        public void Update(IEnumerable<NotificationQueue> notifications)
        {
            this.Context.UpdateRange(notifications);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Cancel the notification for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async System.Threading.Tasks.Task<NotificationQueue> CancelNotificationAsync(int id)
        {
            var notification = Get(id);
            await _notifyService.CancelAsync(notification);
            Update(notification);

            return notification;
        }

        #region Project Notifications
        /// <summary>
        /// Generate an array of notifications for the specified 'project', and for the specified 'fromStatusId' and 'toStatusId'.
        /// This will generate all notifications that should be generated for the specified status transition,
        /// along with any notifications that are only specifically for the 'toStatusId'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="fromStatusId"></param>
        /// <param name="toStatusId"></param>
        /// <param name="includeOnlyTo">Control whether transitions only require a `To Status`, not a `From Status`.</param>
        /// <returns></returns>
        public IEnumerable<NotificationQueue> GenerateNotifications(Project project, int? fromStatusId, int? toStatusId, bool includeOnlyTo = true)
        {
            if (project == null) throw new ArgumentNullException(nameof(project));

            var options = this.Context.ProjectStatusNotifications
                .Include(n => n.Template)
                .Where(n => !n.Template.IsDisabled
                    && (n.FromStatusId == fromStatusId || (includeOnlyTo && n.FromStatusId == null))
                    && n.ToStatusId == toStatusId).ToArray();

            var parcelIds = project.Properties.Where(p => p.PropertyType == PropertyTypes.Land).Select(p => p.ParcelId).ToArray();
            this.Context.Parcels
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Classification)
                .Where(p => parcelIds.Contains(p.Id)).Load();

            var buildingIds = project.Properties.Where(p => p.PropertyType == PropertyTypes.Building).Select(p => p.BuildingId).ToArray();
            this.Context.Buildings
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Classification)
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.BuildingPredominateUse)
                .Where(p => buildingIds.Contains(p.Id)).Load();

            var queue = new List<NotificationQueue>();
            foreach (var o in options)
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
            if (project == null) throw new ArgumentNullException(nameof(project));
            if (options == null) throw new ArgumentNullException(nameof(options));
            if (options.Template == null) throw new ArgumentNullException(nameof(options), "Argument property 'Template' is cannot be null.");

            var env = new EnvironmentModel(_options.Environment.Uri, _options.Environment.Name, _options.Environment.Title);
            var notifications = new List<NotificationQueue>();
            if (options.Template.Audience == NotificationAudiences.ProjectOwner)
            {
                var toAddress = this.Context.Users.Where(u => u.Id == project.CreatedById).Select(u => u.Email).FirstOrDefault();
                // Generate a notification for the owner of the project, which is the user who created it.
                notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, project.Agency, toAddress), sendOn));
            }
            else if (options.Template.Audience == NotificationAudiences.OwningAgency)
            {
                // Generate a notification for the owning agency of the project.
                notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, project.Agency), sendOn));
            }
            else if (options.Template.Audience == NotificationAudiences.Agencies)
            {
                // Generate a notification for all enabled agencies that have not turned of emails, or indicated they are not interested in the project.
                var agencies = (from a in this.Context.Agencies
                                join par in this.Context.ProjectAgencyResponses on new { AgencyId = a.Id, ProjectId = project.Id } equals new { par.AgencyId, par.ProjectId } into g
                                from n in g.DefaultIfEmpty()
                                where !a.IsDisabled && a.SendEmail && (n == null || (n.Response != NotificationResponses.Unsubscribe && n.Response != NotificationResponses.Watch))
                                select a).ToArray();

                foreach (var agency in agencies)
                {
                    notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, agency), sendOn));
                }
            }
            else if (options.Template.Audience == NotificationAudiences.ParentAgencies)
            {
                // Generate a notification for all enabled parent agencies that have not turned of emails, or asked to ignore the project.
                var agencies = (from a in this.Context.Agencies
                                join par in this.Context.ProjectAgencyResponses on new { AgencyId = a.Id, ProjectId = project.Id } equals new { par.AgencyId, par.ProjectId } into g
                                from n in g.DefaultIfEmpty()
                                where a.ParentId == null
                                 && !a.IsDisabled
                                 && a.SendEmail
                                 && (n == null || (n.Response != NotificationResponses.Unsubscribe && n.Response != NotificationResponses.Watch))
                                select a).ToArray();

                foreach (var agency in agencies)
                {
                    notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, agency), sendOn));
                }
            }
            else if (options.Template.Audience == NotificationAudiences.Default)
            {
                // Generate a notification for the default specified 'To' email addresses.
                notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project), sendOn));
            }
            else if (options.Template.Audience == NotificationAudiences.WatchingAgencies)
            {
                // Generate a notification for agencies that have expressed interest.
                var agencies = (from a in this.Context.Agencies
                                join par in this.Context.ProjectAgencyResponses on new { AgencyId = a.Id, ProjectId = project.Id } equals new { par.AgencyId, par.ProjectId } into g
                                from n in g.DefaultIfEmpty()
                                where !a.IsDisabled
                                 && a.SendEmail
                                 && n != null
                                 && n.Response == NotificationResponses.Watch
                                select a).ToArray();

                foreach (var agency in agencies)
                {
                    notifications.Add(GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, agency), sendOn));
                }
            }

            return notifications.NotNull();
        }

        /// <summary>
        /// Generate a notification for the specified 'project', 'options' and 'agency'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="options"></param>
        /// <param name="agency"></param>
        /// <param name="sendOn">When provided the notification will be sent on this date.</param>
        /// <returns></returns>
        public NotificationQueue GenerateNotification(Project project, ProjectStatusNotification options, Agency agency, DateTime? sendOn = null)
        {
            if (project == null) throw new ArgumentNullException(nameof(project));
            if (options == null) throw new ArgumentNullException(nameof(options));
            if (options.Template == null) throw new ArgumentNullException(nameof(options), "Argument property 'Template' is cannot be null.");

            var env = new EnvironmentModel(_options.Environment.Uri, _options.Environment.Name, _options.Environment.Title);
            return GenerateNotification(options, new ProjectNotificationModel(Guid.NewGuid(), env, project, agency), sendOn);
        }

        /// <summary>
        /// Generate a notification for the specified 'project' and 'templateName'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="templateName"></param>
        /// <returns></returns>
        public NotificationQueue GenerateNotification(Project project, string templateName)
        {
            var template = this.Context.NotificationTemplates.FirstOrDefault(n => n.Name == templateName) ?? throw new InvalidOperationException($"Notification template '{templateName}' does not exist.");
            return GenerateNotification(project, template);
        }

        /// <summary>
        /// Generate a notification for the specified 'project' and 'template'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="template"></param>
        /// <returns></returns>
        public NotificationQueue GenerateNotification(Project project, NotificationTemplate template)
        {
            if (project == null) throw new ArgumentNullException(nameof(project));
            if (template == null) throw new ArgumentNullException(nameof(template));

            var env = new EnvironmentModel(_options.Environment.Uri, _options.Environment.Name, _options.Environment.Title);
            var model = new ProjectNotificationModel(Guid.NewGuid(), env, project, project.Agency);
            var email = (!String.IsNullOrWhiteSpace(project.Agency.Email) && template.Audience != NotificationAudiences.ProjectOwner) ? project.Agency.Email :
                this.Context.Users.FirstOrDefault(u => u.Id == project.CreatedById)?.Email;
            var cc = project.Agency.CCEmail;

            return GenerateNotification(email, cc, template, model);
        }
        #endregion

        /// <summary>
        /// Send the notifications to CHES.
        /// Update the queue with the latest information.
        /// </summary>
        /// <param name="notifications"></param>
        /// <param name="saveChanges"></param>
        /// <returns></returns>
        public async System.Threading.Tasks.Task SendNotificationsAsync(IEnumerable<NotificationQueue> notifications, bool saveChanges = true)
        {
            if (notifications == null) throw new ArgumentNullException(nameof(notifications));

            foreach (var notification in notifications)
            {
                if (this.Context.Entry(notification).State == EntityState.Detached) this.Context.NotificationQueue.Add(notification);
                try
                {
                    await _notifyService.SendAsync(notification);
                }
                catch (Exception ex)
                {
                    this.Logger.LogError(ex, $"Failed to send notification '{notification.Id}'.");
                    if (_options.Notifications.ThrowExceptions)
                        throw;
                }
            }

            // Update the notification queue to include the CHES references.
            if (notifications.Any() && saveChanges) this.Context.CommitTransaction();
        }

        /// <summary>
        /// Generates the notification for the specified 'model' and 'template'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="to"></param>
        /// <param name="cc"></param>
        /// <param name="template"></param>
        /// <param name="model"></param>
        /// <param name="sendOn"></param>
        /// <returns></returns>
        public NotificationQueue GenerateNotification<T>(string to, string cc, NotificationTemplate template, T model, DateTime? sendOn = null)
        {
            if (template == null) throw new ArgumentNullException(nameof(template));
            if (model == null) throw new ArgumentNullException(nameof(model));

            var notification = new NotificationQueue(template, to, template.Subject, template.Body)
            {
                Key = Guid.NewGuid(),
                Status = NotificationStatus.Pending,
                SendOn = sendOn ?? DateTime.UtcNow,
                To = String.Join(";", new[] { to, template.To }.Select(v => !String.IsNullOrWhiteSpace(v))),
                Cc = String.Join(";", new[] { cc, template.Cc }.Select(v => !String.IsNullOrWhiteSpace(v))),
                Bcc = template.Bcc
            };

            try
            {
                _notifyService.Generate(notification, model);
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, $"Failed to generate notification for template '{template.Id}'.");
                if (_options.Notifications.ThrowExceptions)
                    throw;
                return null;
            }
            return notification;
        }

        /// <summary>
        /// Generates the access request notification for the specified 'model' and 'template'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="template"></param>
        /// <param name="model"></param>
        /// <param name="sendOn"></param>
        /// <returns></returns>
        public NotificationQueue GenerateNotification<T>(NotificationTemplate template, T model, DateTime? sendOn = null)
        {
            if (template == null) throw new ArgumentNullException(nameof(template));
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (String.IsNullOrEmpty(template.To)) throw new ArgumentException("Template requires a 'to'.", nameof(template));

            var notification = new NotificationQueue(template, template.To, template.Subject, template.Body)
            {
                Key = Guid.NewGuid(),
                Status = NotificationStatus.Pending,
                SendOn = sendOn ?? DateTime.UtcNow,
                To = template.To,
                Cc = template.Cc,
                Bcc = template.Bcc
            };

            try
            {
                _notifyService.Generate(notification, model);
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, $"Failed to generate notification for template '{template.Id}'.");
                if (_options.Notifications.ThrowExceptions)
                    throw;
                return null;
            }
            return notification;
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
        /// <param name="sendOn">When provided the notification will be sent on this date.</param>
        /// <returns></returns>
        private NotificationQueue GenerateNotification(ProjectStatusNotification options, ProjectNotificationModel model, DateTime? sendOn = null)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (options == null) throw new ArgumentNullException(nameof(options));
            if (options.Template == null) throw new ArgumentNullException(nameof(options), "Argument property 'Template' is cannot be null.");

            var now = DateTime.UtcNow;
            sendOn ??= options.Delay switch
            {
                NotificationDelays.Days => now.AddDays(options.DelayDays),
                NotificationDelays.EndOfDay => DateTime.Now.Date,
                NotificationDelays.EndOfMonth => new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month)).Date,
                NotificationDelays.SetDate => sendOn,
                _ => now
            };
            var notification = new NotificationQueue(options.Template, model.Project, model.ToAgency, options.Template.Subject, options.Template.Body)
            {
                Key = model.NotificationKey,
                Status = NotificationStatus.Pending,
                Priority = options.Priority,
                SendOn = sendOn.Value,
                To = String.Join(";", new[] { model.To ?? model.ToAgency?.Email, options.Template.To }.NotNull()),
                Cc = String.Join(";", new[] { model.ToAgency?.CCEmail, options.Template.Cc }.NotNull()),
                Bcc = options.Template.Bcc
            };

            try
            {
                _notifyService.Generate(notification, model);
            }
            catch (Exception ex)
            {
                this.Logger.LogError(ex, $"Failed to generate notification for template '{options.TemplateId}'.");
                if (_options.Notifications.ThrowExceptions)
                    throw;
                return null;
            }
            return notification;
        }
        #endregion
    }
}
