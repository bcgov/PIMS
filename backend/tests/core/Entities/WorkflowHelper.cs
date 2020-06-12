using Pims.Core.Extensions;
using Pims.Dal;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a Workflow.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Workflow CreateWorkflow(int id, string name, string code = null, IEnumerable<Entity.ProjectStatus> status = null)
        {
            var workflow = new Entity.Workflow(name, code ?? name) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };
            if (status?.Any() == true)
            {
                status.ForEach(s => workflow.Status.Add(new Entity.WorkflowProjectStatus(workflow, s)));
            }
            return workflow;
        }

        /// <summary>
        /// Creates a default list of Workflow.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflows()
        {
            return new List<Entity.Workflow>()
            {
                new Entity.Workflow("Submit", "DISPOSE-SUBMIT") { Id = 1, SortOrder = 0, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Access", "DISPOSE-ACCESS") { Id = 2, SortOrder = 1, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }

        /// <summary>
        /// Creates a default list of workflows and adds them to the specified 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflows(this PimsContext context)
        {
            var workflows = CreateDefaultWorkflows();
            context.Workflows.AddRange(workflows);
            return workflows;
        }
    }
}
