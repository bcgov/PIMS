using Pims.Dal.Entities;
using System.Linq;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// WorkflowExtensions static class, provides extension methods for workflows.
    /// </summary>
    public static class WorkflowExtensions
    {
        /// <summary>
        /// Add a new project status to the specified 'workflow'.
        /// </summary>
        /// <param name="workflow"></param>
        /// <param name="status"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public static WorkflowProjectStatus AddStatus(this Workflow workflow, ProjectStatus status, int sortOrder)
        {
            var workflowStatus = new WorkflowProjectStatus(workflow, status, sortOrder);
            workflow.Status.Add(workflowStatus);
            return workflowStatus;
        }

        /// <summary>
        /// Add a workflow project status transition to the specified workflow project status 'workflowStatus'.
        /// This adds a status to the current workflow and a transition from the source 'workflowStatus' to the destination 'toStatus'.
        /// Creates a new instance of a WorkflowProjectStatus.
        /// Creates a new instance of a ProjectStatusTransition.
        /// </summary>
        /// <param name="workflowStatus">The workflow project status to add a transition to.</param>
        /// <param name="action">The action name to describe the transition.</param>
        /// <param name="toStatus">The project status that will be transitions to.</param>
        /// <param name="sortOrder">The order that the workflow project status is in.</param>
        /// <returns></returns>
        public static WorkflowProjectStatus AddTransition(this WorkflowProjectStatus workflowStatus, string action, ProjectStatus toStatus, int sortOrder)
        {
            var toWorkflowStatus = workflowStatus.Workflow.AddStatus(toStatus, sortOrder);
            workflowStatus.AddTransition(action, toWorkflowStatus);
            return toWorkflowStatus;
        }

        /// <summary>
        /// Add a workflow project status transition to the specified workflow project status 'workflowStatus'.
        /// This adds a status to the destionation workflow 'toWorkflow' and a transition from the source 'workflowStatus' to the destination workflow 'toWorkflow' and 'toStatus'.
        /// Creates a new instance of a WorkflowProjectStatus.
        /// Creates a new instance of a ProjectStatusTransition.
        /// </summary>
        /// <param name="workflowStatus">The workflow project status to add a transition to.</param>
        /// <param name="action">The action name to describe the transition.</param>
        /// <param name="toWorkflow">The workflow that will be transitioned to.</param>
        /// <param name="toStatus">The project status that will be transitions to.</param>
        /// <param name="sortOrder">The order that the workflow project status is in.</param>
        /// <returns></returns>
        public static WorkflowProjectStatus AddTransition(this WorkflowProjectStatus workflowStatus, string action, Workflow toWorkflow, ProjectStatus toStatus, int sortOrder)
        {
            var toWorkflowStatus = toWorkflow.Status.FirstOrDefault(s => s.StatusId == toStatus.Id) ?? toWorkflow.AddStatus(toStatus, sortOrder);
            workflowStatus.AddTransition(action, toWorkflowStatus);
            return toWorkflowStatus;
        }

        /// <summary>
        /// Add a workflow project status transition to the specified workflow project status 'toWorkflowStatus'.
        /// Creates a new instance of a ProjectStatusTransition.
        /// </summary>
        /// <param name="workflowStatus">The workflow project status to add a transition to.</param>
        /// <param name="action">The action name to describe the transition.</param>
        /// <param name="toWorkflowStatus">The workflow project status that will be transitioned to.</param>
        /// <returns></returns>
        public static ProjectStatusTransition AddTransition(this WorkflowProjectStatus workflowStatus, string action, WorkflowProjectStatus toWorkflowStatus)
        {
            var toTransition = workflowStatus.ToStatus.FirstOrDefault(s => s.ToStatusId == toWorkflowStatus.StatusId) ?? new ProjectStatusTransition(workflowStatus, action, toWorkflowStatus);
            return toTransition;
        }
    }
}
