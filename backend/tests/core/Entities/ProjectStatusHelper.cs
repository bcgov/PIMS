using Pims.Core.Helpers;
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
        /// Create a new instance of a ProjectStatus.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Entity.ProjectStatus CreateProjectStatus(string name, string code)
        {
            return CreateProjectStatus(1, name, code);
        }

        /// <summary>
        /// Create a new instance of a ProjectStatus.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Entity.ProjectStatus CreateProjectStatus(int id, string name, string code)
        {
            return new Entity.ProjectStatus(name, code) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a random list of ProjectStatus.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public static List<Entity.ProjectStatus> CreateProjectStatuses(int startId, int quantity)
        {
            var status = new List<Entity.ProjectStatus>();

            for (var i = startId; i < quantity; i++)
            {
                var name = StringHelper.Generate(10);
                status.Add(new Entity.ProjectStatus(name, name) { Id = i, SortOrder = 0, RowVersion = new byte[] { 12, 13, 14 } });
            }

            return status;
        }

        /// <summary>
        /// Creates a default list of ProjectStatus.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.ProjectStatus> CreateDefaultProjectStatuses()
        {
            return new List<Entity.ProjectStatus>()
            {
                new Entity.ProjectStatus("Draft", "DR") { Id = 1, SortOrder = 0, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Select Properties", "DR-P") { Id = 2, SortOrder = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Update Information", "DR-I") { Id = 3, SortOrder = 2, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Required Documentation", "DR-D") { Id = 4, SortOrder = 3, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approval", "DR-A") { Id = 5, SortOrder = 4, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Submitted", "SU") { Id = 6, SortOrder = 5, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
