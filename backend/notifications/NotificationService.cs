using Microsoft.Extensions.Options;
using Pims.Ches;
using Pims.Core.Extensions;
using Pims.Notifications.Configuration;
using RazorEngine;
using RazorEngine.Templating;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Model = Pims.Notifications.Models;

namespace Pims.Notifications
{
    /// <summary>
    /// NotificationService class, provides a service for generating notifications.
    /// </summary>
    public class NotificationService : INotificationService
    {
        #region Variables
        private const string SUBJECT_TEMPLATE_KEY = "template-subject:{0}";
        private const string BODY_TEMPLATE_KEY = "template-body:{0}";
        private readonly Dictionary<string, Model.IEmailTemplate> _cache = new Dictionary<string, Model.IEmailTemplate>();
        #endregion

        #region Properties
        protected IChesService Ches { get; }
        public NotificationOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a NotificationService, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="ches"></param>
        public NotificationService(IOptions<NotificationOptions> options, IChesService ches)
        {
            this.Options = options.Value;
            this.Ches = ches;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Build the specified 'template' and merge the specified 'model'.
        /// Mutate the specified 'template' Subject and Body properties.
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="templateKey"></param>
        /// <param name="template"></param>
        /// <param name="model"></param>
        public void Build<TModel>(string templateKey, Model.IEmailTemplate template, TModel model)
        {
            if (String.IsNullOrWhiteSpace(templateKey)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(templateKey));
            if (template == null) throw new ArgumentNullException(nameof(template));

            CompileTemplate<TModel>(templateKey, template);

            Merge(templateKey, template, model);
        }

        /// <summary>
        /// Build the specified 'email' templates and merge the specified 'model'.
        /// Mutate the specified 'email' Subject and Body properties.
        /// Send the notification to CHES.
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="templateKey"></param>
        /// <param name="email"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<Model.EmailResponse> SendNotificationAsync<TModel>(string templateKey, Model.IEmail email, TModel model)
        {
            Build(templateKey, email, model);
            return await SendNotificationAsync(email);
        }

        /// <summary>
        /// Send the specified 'notification' to CHES.
        /// </summary>
        /// <param name="notification"></param>
        /// <returns></returns>
        public async Task<Model.EmailResponse> SendNotificationAsync(Model.IEmail email)
        {
            if (email == null) throw new ArgumentNullException(nameof(email));
            var response = await this.Ches.SendEmailAsync(new Ches.Models.EmailModel()
            {
                From = email.From,
                To = email.To,
                Cc = email.Cc,
                Bcc = email.Bcc,
                Encoding = email.Encoding.ConvertTo<Model.EmailEncodings, Ches.Models.EmailEncodings>(),
                Priority = email.Priority.ConvertTo<Model.EmailPriorities, Ches.Models.EmailPriorities>(),
                BodyType = email.BodyType.ConvertTo<Model.EmailBodyTypes, Ches.Models.EmailBodyTypes>(),
                Subject = email.Subject,
                Body = email.Body,
                Tag = email.Tag,
                SendOn = email.SendOn,
            });

            return new Model.EmailResponse(response);
        }

        /// <summary>
        /// Send all the specified 'notifications' as a single transaction to CHES.
        /// Note that the first notification will govern the following properties for all other notifications (From, Encoding, Priority, BodyType).
        /// </summary>
        /// <param name="notifications"></param>
        /// <returns></returns>
        public async Task<Model.EmailResponse> SendNotificationsAsync(IEnumerable<Model.IEmail> notifications)
        {
            if (notifications == null) throw new ArgumentNullException(nameof(notifications));

            var primary = notifications.First();
            var merge = new Ches.Models.EmailMergeModel()
            {
                From = primary.From,
                Encoding = primary.Encoding.ConvertTo<Model.EmailEncodings, Ches.Models.EmailEncodings>(),
                Priority = primary.Priority.ConvertTo<Model.EmailPriorities, Ches.Models.EmailPriorities>(),
                BodyType = primary.BodyType.ConvertTo<Model.EmailBodyTypes, Ches.Models.EmailBodyTypes>(),
                Subject = "{{ subject }}",
                Body = "{{ body }}",
                Contexts = notifications.Select(n => new Ches.Models.EmailContextModel()
                {
                    To = n.To,
                    Cc = n.Cc,
                    Bcc = n.Bcc,
                    Tag = n.Tag,
                    SendOn = n.SendOn,
                    Context = new
                    {
                        subject = n.Subject,
                        body = n.Body
                    }
                })
            };

            var response = await this.Ches.SendEmailAsync(merge);

            return new Model.EmailResponse(response);
        }

        /// <summary>
        /// Get the status of the message for the specified 'messageId'.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns></returns>
        public async Task<Model.StatusResponse> GetStatusAsync(Guid messageId)
        {
            var response = await this.Ches.GetStatusAsync(messageId);

            return new Model.StatusResponse(response);
        }

        /// <summary>
        /// Get the status of the message for the specified 'messageId'.
        /// </summary>
        /// <param name="messageId"></param>
        /// <returns></returns>
        public async Task<Model.StatusResponse> CancelNotificationAsync(Guid messageId)
        {
            var response = await this.Ches.CancelEmailAsync(messageId);

            return new Model.StatusResponse(response);
        }
        #endregion

        #region Helpers
        /// <summary>
        /// Compile the templates before running them.
        /// </summary>
        /// <param name="options"></param>
        private void CompileTemplate<TModel>(string templateKey, Model.IEmailTemplate template)
        {
            var subjectKey = String.Format(SUBJECT_TEMPLATE_KEY, templateKey);
            var type = typeof(TModel) == typeof(object) || typeof(TModel).IsAnonymousType() ? null : typeof(TModel);
            if (!_cache.ContainsKey(subjectKey))
            {
                Engine.Razor.Compile(template.Subject, subjectKey, type);
                _cache.Add(subjectKey, template);
            }

            var bodyKey = String.Format(BODY_TEMPLATE_KEY, templateKey);
            if (!_cache.ContainsKey(bodyKey))
            {
                Engine.Razor.Compile(template.Body, bodyKey, type);
                _cache.Add(bodyKey, template);
            }
        }

        /// <summary>
        /// Run the template 
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <param name="templateKey"></param>
        /// <param name="template"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        private void Merge<TModel>(string templateKey, Model.IEmailTemplate template, TModel model)
        {
            var type = typeof(TModel) == typeof(object) || typeof(TModel).IsAnonymousType() ? null : typeof(TModel);
            template.Subject = Engine.Razor.Run(String.Format(SUBJECT_TEMPLATE_KEY, templateKey), type, model);
            template.Body = Engine.Razor.Run(String.Format(BODY_TEMPLATE_KEY, templateKey), type, model);
        }
        #endregion
    }
}
