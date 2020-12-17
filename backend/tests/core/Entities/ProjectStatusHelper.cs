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
        public static List<Entity.ProjectStatus> CreateProjectStatus(int startId, int quantity)
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
        public static List<Entity.ProjectStatus> CreateDefaultProjectStatus()
        {
            return new List<Entity.ProjectStatus>()
            {
                new Entity.ProjectStatus("Draft", "DR") { Id = 1, SortOrder = 0, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Select Properties", "DR-P") { Id = 2, SortOrder = 1, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Update Information", "DR-I") { Id = 3, SortOrder = 2, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Required Documentation", "DR-D") { Id = 4, SortOrder = 3, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approval", "DR-A") { Id = 5, SortOrder = 4, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Review", "DR-RE") { Id = 6, SortOrder = 5, Route = "{DR}", RowVersion = new byte[] { 12, 13, 14 } },

                new Entity.ProjectStatus("Submitted", "AS-I") { Id = 7, SortOrder = 6, IsMilestone = true, Route = "{AS}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Submitted Exemption", "AS-EXE") { Id = 8, SortOrder = 6, IsMilestone = true, Route = "{AS-EX}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Document Review", "AS-D") { Id = 10, SortOrder = 7, Route = "{AS}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Appraisal Review", "AS-AP") { Id = 11, SortOrder = 8, Route = "{AS}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("First Nations Consultation", "AS-FNC") { Id = 12, SortOrder = 9, Route = "{AS}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Exemption Review", "AS-EXP") { Id = 13, SortOrder = 10, Route = "{AS-EX}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approved for ERP", "AP-ERP") { Id = 14, SortOrder = 11, IsMilestone = true, Route = "{AS}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approved for Exemption", "AP-EXE") { Id = 15, SortOrder = 11, IsMilestone = true, Route = "{AS-EX}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Denied", "DE") { Id = 16, SortOrder = 11, IsMilestone = true, Route = "{AS}, {AS-EX}", RowVersion = new byte[] { 12, 13, 14 } },

                new Entity.ProjectStatus("Transferred within GRE", "T-GRE") { Id = 20, SortOrder = 21, IsMilestone = true, Route = "{EX}, {ERP}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Approved for SPL", "AP-SPL") { Id = 21, SortOrder = 21, IsMilestone = true, Route = "{EX}, {ERP}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Not in SPL", "AP-!SPL") { Id = 22, SortOrder = 21, IsMilestone = true, Route = "{EX}, {ERP}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Cancelled", "CA") { Id = 23, SortOrder = 21, IsMilestone = true, Route = "{EX}, {ERP}, {SPL}", RowVersion = new byte[] { 12, 13, 14 } },

                new Entity.ProjectStatus("In ERP", "ERP-ON") { Id = 30, SortOrder = 1, Route = "{ERP}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("On Hold", "ERP-OH") { Id = 31, SortOrder = 2, Route = "{ERP}", RowVersion = new byte[] { 12, 13, 14 } },

                new Entity.ProjectStatus("Disposed", "DIS") { Id = 32, SortOrder = 21, IsMilestone = true, Route = "{EX}, {ERP}", RowVersion = new byte[] { 12, 13, 14 } },

                new Entity.ProjectStatus("Pre-Marketing", "SPL-PM") { Id = 40, SortOrder = 18, Route = "{SPL}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Marketing", "SPL-M") { Id = 41, SortOrder = 19, Route = "{SPL}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Contract in Place - Conditional", "SPL-CIP-C") { Id = 42, SortOrder = 20, Route = "{SPL}", RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectStatus("Contract in Place - Unconditional", "SPL-CIP-U") { Id = 43, SortOrder = 21, Route = "{SPL}", RowVersion = new byte[] { 12, 13, 14 } }
            };
        }

        /// <summary>
        /// Create a default list of project status and add them to 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.ProjectStatus> CreateDefaultProjectStatus(this PimsContext context)
        {
            var status = CreateDefaultProjectStatus();
            context.ProjectStatus.AddRange(status);
            return status;
        }

        /// <summary>
        /// Creates a new project status and adds it to the 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public static Entity.ProjectStatus CreateProjectStatus(this PimsContext context, int id, string name, string code)
        {
            var status = CreateProjectStatus(id, name, code);
            context.ProjectStatus.Add(status);
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
