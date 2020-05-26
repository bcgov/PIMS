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
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.ProjectStatus CreateProjectStatus(int id, string name)
        {
            return new Entity.ProjectStatus(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a ProjectStatus.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.ProjectStatus CreateProjectStatus(string name)
        {
            return new Entity.ProjectStatus(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of ProjectStatus.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.ProjectStatus> CreateProjectStatuses()
        {
            return new List<Entity.ProjectStatus>()
            {
                new Entity.ProjectStatus(0, "Draft") { SortOrder = 0, Workflow = "SubmitDisposal", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus(1, "Select Properties") { SortOrder = 1, Workflow = "SubmitDisposal", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus(2, "Update Information") { SortOrder = 2, Workflow = "SubmitDisposal", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus(3, "Required Documentation") { SortOrder = 3, Workflow = "SubmitDisposal", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus(4, "Approval") { SortOrder = 4, Workflow = "SubmitDisposal", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus(5, "Submitted") { SortOrder = 5, Workflow = "SubmitDisposal,ReviewDisposal", RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
