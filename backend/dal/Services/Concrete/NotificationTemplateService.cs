using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Ches;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Pims.Dal.Services
{
    /// <summary>
    /// NotificationTemplateService class, provides a service layer to interact with notification templates within the datasource.
    /// </summary>
    public class NotificationTemplateService : BaseService<NotificationTemplate>, INotificationTemplateService
    {
        #region Variables
        private readonly INotificationService _notifyService;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a NotificationTemplateService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="notifyService"></param>
        /// <param name="logger"></param>
        public NotificationTemplateService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, INotificationService notifyService, ILogger<TaskService> logger) : base(dbContext, user, service, logger)
        {
            _notifyService = notifyService;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get all of the notification templates.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<NotificationTemplate> Get()
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            return this.Context.NotificationTemplates
                .AsNoTracking()
                .Include(t => t.Status)
                .OrderBy(t => t.Name)
                .ToArray();
        }

        /// <summary>
        /// Get the notification template for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">The notification template does not exist for the specified 'id'.</exception>
        /// <returns></returns>
        public NotificationTemplate Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            return this.Context.NotificationTemplates
                .Include(t => t.Status)
                .ThenInclude(s => s.FromStatus)
                .Include(t => t.Status)
                .ThenInclude(s => s.ToStatus)
                .FirstOrDefault(t => t.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add a new notification template to the datasource.
        /// </summary>
        /// <param name="template"></param>
        /// <returns></returns>
        public NotificationTemplate Add(NotificationTemplate template)
        {
            template.ThrowIfNull(nameof(template));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            this.Context.NotificationTemplates.Add(template);
            this.Context.CommitTransaction();

            return template;
        }

        /// <summary>
        /// Update the specified notification 'template' in the datasource.
        /// </summary>
        /// <param name="template"></param>
        /// <returns></returns>
        public NotificationTemplate Update(NotificationTemplate template)
        {
            template.ThrowIfNotAllowedToEdit(nameof(template), this.User, new[] { Permissions.SystemAdmin });

            var etemplate = this.Context.NotificationTemplates
                .Include(t => t.Status)
                .FirstOrDefault(t => t.Id == template.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(etemplate).CurrentValues.SetValues(template); // TODO: Need to handle removing project status notifications.
            this.Context.SetOriginalRowVersion(etemplate);

            this.Context.NotificationTemplates.Update(etemplate);
            this.Context.CommitTransaction();

            return etemplate;
        }

        /// <summary>
        /// Remove the specified notification 'template' from the datasource.
        /// </summary>
        /// <param name="template"></param>
        public void Remove(NotificationTemplate template)
        {
            template.ThrowIfNotAllowedToEdit(nameof(template), this.User, new[] { Permissions.SystemAdmin });

            var etemplate = this.Context.NotificationTemplates
                .Include(t => t.Status)
                .FirstOrDefault(t => t.Id == template.Id) ?? throw new KeyNotFoundException();

            etemplate.Status.Clear();

            this.Context.NotificationTemplates.Remove(etemplate);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Send an email notification for the specified notification template 'templateId' to the specified list of email addresses in 'to'.
        /// </summary>
        /// <param name="templateId"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        public async Task<NotificationQueue> SendNotificationAsync<T>(int templateId, string to, T model = null) where T : class // TODO: Allow for a way to pass a model to this function.
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            if (String.IsNullOrWhiteSpace(to)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(to));

            var template = this.Context.NotificationTemplates.Find(templateId) ?? throw new KeyNotFoundException();
            var notification = new NotificationQueue(template, to, template.Subject, template.Body);

            this.Context.NotificationQueue.Add(notification);
            this.Context.CommitTransaction();

            Exception error = null;

            try
            {
                var email = new Notifications.Models.Email()
                {
                    To = notification.To.Split(";"),
                    Cc = notification.Cc?.Split(";"),
                    Bcc = notification.Bcc?.Split(";"),
                    Encoding = notification.Encoding.ConvertTo<NotificationEncodings, Notifications.Models.EmailEncodings>(),
                    BodyType = notification.BodyType.ConvertTo<NotificationBodyTypes, Notifications.Models.EmailBodyTypes>(),
                    Priority = notification.Priority.ConvertTo<NotificationPriorities, Notifications.Models.EmailPriorities>(),
                    Subject = notification.Subject, 
                    Body = notification.Body,
                    Tag = notification.Tag,
                    SendOn = notification.SendOn,
                };
                var response = await _notifyService.SendNotificationAsync(templateId.ToString(), email, model);

                notification.ChesTransactionId = response.TransactionId;
                notification.ChesMessageId = response.Messages.First().MessageId;
            }
            catch (Exception ex)
            {
                notification.Status = NotificationStatus.Failed;
                error = ex;
            }

            this.Context.CommitTransaction();

            if (error != null) throw error;

            return notification;
        }
        #endregion
    }
}
