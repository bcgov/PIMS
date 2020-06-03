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
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(int id, string name, Entity.ProjectStatus status = null)
        {
            var task = new Entity.Task(name) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };

            if (status != null)
            {
                status.Tasks.Add(new Entity.ProjectStatusTask(status, task));
            }

            return task;
        }

        /// <summary>
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(string name, Entity.ProjectStatus status = null)
        {
            var task = new Entity.Task(name) { Id = 1, RowVersion = new byte[] { 12, 13, 14 } };

            if (status != null)
            {
                status.Tasks.Add(new Entity.ProjectStatusTask(status, task));
            }

            return task;
        }

        /// <summary>
        /// Creates a default list of tasks.
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public static List<Entity.Task> CreateDefaultTasks(Entity.ProjectStatus status = null)
        {
            var tasks = new List<Entity.Task>()
            {
                new Entity.Task("Task 1") { Id = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Task("Task 2") { Id = 2, RowVersion = new byte[] { 12, 13, 14 } }
            };

            if (status != null)
            {
                foreach (var task in tasks)
                {
                    status.Tasks.Add(new Entity.ProjectStatusTask(status, task));
                }
            }

            return tasks;
        }

        /// <summary>
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(this PimsContext context, int id, string name, Entity.ProjectStatus status)
        {
            var task = new Entity.Task(name)
            {
                Id = id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            if (status != null)
            {
                status.Tasks.Add(new Entity.ProjectStatusTask(status, task));
                context.ProjectStatus.Update(status);
            }

            context.Tasks.Add(task);
            return task;
        }
    }
}
