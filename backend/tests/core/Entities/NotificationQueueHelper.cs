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
        #region To
        /// <summary>
        /// Create a new instance of a NotificationQueue.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="template"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static Entity.NotificationQueue CreateNotificationQueue(int id, Entity.NotificationTemplate template, string to = "test@test.com", string subject = "test", string body = "test")
        {
            return new Entity.NotificationQueue(template, to, subject, body)
            {
                Id = id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = new DateTime(2019, 1, 1, 18, 23, 22, DateTimeKind.Utc),
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of NotificationQueues.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="template"></param>
        /// <returns></returns>
        public static List<Entity.NotificationQueue> CreateNotificationQueues(int startId, int count, Entity.NotificationTemplate template)
        {
            var notifications = new List<Entity.NotificationQueue>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                notifications.Add(CreateNotificationQueue(i, template));
            }
            return notifications;
        }

        /// <summary>
        /// Create a new instance of a NotificationQueue.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="template"></param>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static Entity.NotificationQueue CreateNotificationQueue(this PimsContext context, int id, Entity.NotificationTemplate template, string to = "test@test.com", string subject = "test", string body = "test")
        {
            var notification = CreateNotificationQueue(id, template, to, subject, body);
            context.NotificationQueue.Add(notification);
            return notification;
        }

        /// <summary>
        /// Create a new List with new instances of NotificationQueues.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="template"></param>
        /// <returns></returns>
        public static List<Entity.NotificationQueue> CreateNotificationQueues(this PimsContext context, int startId, int count, Entity.NotificationTemplate template)
        {
            var templates = new List<Entity.NotificationQueue>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                templates.Add(context.CreateNotificationQueue(i, template));
            }
            return templates;
        }
        #endregion

        #region Project
        /// <summary>
        /// Create a new instance of a NotificationQueue.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static Entity.NotificationQueue CreateNotificationQueue(int id, Entity.NotificationTemplate template, Entity.Project project, Entity.Agency agency = null)
        {
            return new Entity.NotificationQueue(template, project, agency ?? project.Agency, "test", "test")
            {
                Id = id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of NotificationQueues.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static List<Entity.NotificationQueue> CreateNotificationQueues(int startId, int count, Entity.NotificationTemplate template, Entity.Project project, Entity.Agency agency = null)
        {
            var notifications = new List<Entity.NotificationQueue>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                notifications.Add(CreateNotificationQueue(i, template, project, agency));
            }
            return notifications;
        }

        /// <summary>
        /// Create a new instance of a NotificationQueue.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static Entity.NotificationQueue CreateNotificationQueue(this PimsContext context, int id, Entity.NotificationTemplate template, Entity.Project project, Entity.Agency agency = null)
        {
            var notification = CreateNotificationQueue(id, template, project, agency);
            context.NotificationQueue.Add(notification);
            return notification;
        }

        /// <summary>
        /// Create a new List with new instances of NotificationQueues.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="template"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static List<Entity.NotificationQueue> CreateNotificationQueues(this PimsContext context, int startId, int count, Entity.NotificationTemplate template, Entity.Project project, Entity.Agency agency = null)
        {
            var templates = new List<Entity.NotificationQueue>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                templates.Add(context.CreateNotificationQueue(i, template, project, agency));
            }
            return templates;
        }
        #endregion
    }
}
