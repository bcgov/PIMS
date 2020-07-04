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
        /// <param name="isOptional"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(int id, string name, Entity.ProjectStatus status = null, bool isOptional = false)
        {
            return new Entity.Task(name, status, isOptional) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <param name="isOptional"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(string name, Entity.ProjectStatus status = null, bool isOptional = false)
        {
            return new Entity.Task(name, status, isOptional) { Id = 1, RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of tasks.
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public static List<Entity.Task> CreateDefaultTasks(Entity.ProjectStatus status = null)
        {
            return new List<Entity.Task>()
            {
                new Entity.Task("Task 1", status) { Id = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Task("Task 2", status) { Id = 2, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }

        /// <summary>
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <param name="isOptional"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(this PimsContext context, int id, string name, Entity.ProjectStatus status = null, bool isOptional = false)
        {
            var task = new Entity.Task(name, status, isOptional)
            {
                Id = id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                IsOptional = false,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            if (status != null)
            {
                context.ProjectStatus.Update(status);
            }

            context.Tasks.Add(task);
            return task;
        }
    }
}
