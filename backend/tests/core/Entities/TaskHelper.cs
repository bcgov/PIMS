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
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(int id, Entity.TaskTypes type, string name)
        {
            return new Entity.Task(id, type, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a Task.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static Entity.Task CreateTask(string name, Entity.TaskTypes type)
        {
            return new Entity.Task(1, type, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of tasks.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static List<Entity.Task> CreateTasks(Entity.TaskTypes type = Entity.TaskTypes.DisposalProjectDocuments)
        {
            return new List<Entity.Task>()
            {
                new Entity.Task(1, type, "Task 1") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Task(2, type, "Task 2") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
