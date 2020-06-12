using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Dal;
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
                new Entity.ProjectStatus("Submitted", "SU") { Id = 6, SortOrder = 5, IsMilestone = true, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approved", "AP-ERP") { Id = 7, SortOrder = 6, IsMilestone = true, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approved", "AP-SPL") { Id = 8, SortOrder = 7, IsMilestone = true, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Denied", "DE") { Id = 9, SortOrder = 8, IsMilestone = true, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }

        /// <summary>
        /// Create a default list of project status and add them to 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.ProjectStatus> CreateDefaultProjectStatuses(this PimsContext context)
        {
            var status = CreateDefaultProjectStatuses();
            context.ProjectStatus.AddRange(status);
            return status;
        }

        /// <summary>
        /// Add the specified 'status' to the specified 'workflow'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="workflow"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static PimsContext AddStatusToWorkflow(this PimsContext context, Entity.Workflow workflow, IEnumerable<Entity.ProjectStatus> status)
        {
            status.ForEach(s => workflow.Status.Add(new Entity.WorkflowProjectStatus(workflow, s)));
            return context;
        }
    }
}
