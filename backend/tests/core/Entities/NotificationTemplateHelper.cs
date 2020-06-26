using Pims.Dal;
using System;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a NotificationTemplate.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static Entity.NotificationTemplate CreateNotificationTemplate(int id, string name, string subject = "test", string body = "test")
        {
            return new Entity.NotificationTemplate(name, subject, body)
            {
                Id = id,
                Description = $"description-{id}",
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of NotificationTemplates.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static List<Entity.NotificationTemplate> CreateNotificationTemplates(int startId, int count, string name = "test")
        {
            var templates = new List<Entity.NotificationTemplate>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                templates.Add(CreateNotificationTemplate(i, $"{name}-{i}"));
            }
            return templates;
        }

        /// <summary>
        /// Create a new instance of a NotificationTemplate.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static Entity.NotificationTemplate CreateNotificationTemplate(this PimsContext context, int id, string name, string subject = "test", string body = "test")
        {
            var template = CreateNotificationTemplate(id, name, subject, body);
            context.NotificationTemplates.Add(template);
            return template;
        }

        /// <summary>
        /// Create a new List with new instances of NotificationTemplates.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="agency"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static List<Entity.NotificationTemplate> CreateNotificationTemplates(this PimsContext context, int startId, int count, string name = "test")
        {
            var templates = new List<Entity.NotificationTemplate>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                templates.Add(context.CreateNotificationTemplate(i, $"{name}-{i}"));
            }
            return templates;
        }
    }
}
