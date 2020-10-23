using Pims.Core.Extensions;
using Pims.Dal;
using System;
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
        /// Create a new instance of a Project.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(int id, int agencyId)
        {
            var agency = EntityHelper.CreateAgency(agencyId);
            return CreateProject(id, agency);
        }

        /// <summary>
        /// Create a new instance of a Project.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="agency"></param>
        /// <param name="tierLevel"></param>
        /// <param name="workflowStatus"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(int id, Entity.Agency agency = null, Entity.TierLevel tierLevel = null, Entity.WorkflowProjectStatus workflowStatus = null, Entity.ProjectRisk risk = null)
        {
            agency ??= EntityHelper.CreateAgency(id);
            tierLevel ??= EntityHelper.CreateTierLevel(id, "tierLevel");
            risk ??= EntityHelper.CreateProjectRisk(id, "risk", "risk", 1);
            var status = workflowStatus?.Status ?? EntityHelper.CreateProjectStatus("Draft", "DR");
            var workflow = workflowStatus?.Workflow ?? EntityHelper.CreateWorkflow(id, "Submit", "SUBMIT-DISPOSAL", new[] { status });

            var user = CreateUser(Guid.NewGuid(), "project tester", "asasa", "asasa", null, agency);
            return new Entity.Project($"SPP-{id:00000}", $"test-{id}", tierLevel)
            {
                ReportedFiscalYear = DateTime.UtcNow.GetFiscalYear(),
                ActualFiscalYear = DateTime.UtcNow.GetFiscalYear(),
                Risk = risk,
                RiskId = risk.Id,
                Agency = agency,
                AgencyId = agency.Id,
                Workflow = workflow,
                WorkflowId = workflow?.Id,
                Status = status,
                StatusId = status.Id,
                Description = $"description-{id}",
                CreatedBy = user,
                CreatedById = user.Id,
                CreatedOn = DateTime.UtcNow,
                UpdatedById = user.Id,
                UpdatedBy = user,
                PublicNote = $"publicNote-{id}",
                PrivateNote = $"privateNote-{id}",
                AppraisedNote = $"appraisedNote-{id}",
                UpdatedOn = DateTime.UtcNow,
                Metadata = "{offerAmount: 123}",
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of Projects.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="agency"></param>
        /// <param name="tierLevel"></param>
        /// <param name="workflowStatus"></param>
        /// <param name="risk"></param>
        /// <returns></returns>
        public static List<Entity.Project> CreateProjects(int startId, int count, Entity.Agency agency = null, Entity.TierLevel tierLevel = null, Entity.WorkflowProjectStatus workflowStatus = null, Entity.ProjectRisk risk = null)
        {
            var projects = new List<Entity.Project>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                projects.Add(CreateProject(i, agency, tierLevel, workflowStatus, risk));
            }
            return projects;
        }

        /// <summary>
        /// Create a new instance of a Project.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(this PimsContext context, int id, int agencyId)
        {
            var agency = context.Agencies.Find(agencyId) ?? EntityHelper.CreateAgency(agencyId);
            return context.CreateProject(id, agency);
        }

        /// <summary>
        /// Create a new instance of a Project.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="agency"></param>
        /// <param name="workflowStatus"></param>
        /// <param name="risk"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(this PimsContext context, int id, Entity.Agency agency = null, Entity.WorkflowProjectStatus workflowStatus = null, Entity.ProjectRisk risk = null)
        {
            agency ??= context.Agencies.OrderBy(a => a.Id).FirstOrDefault() ?? EntityHelper.CreateAgency(1);
            risk ??= context.ProjectRisks.FirstOrDefault() ?? EntityHelper.CreateProjectRisk(1, "risk", "risk", 1);
            workflowStatus ??= context.WorkflowProjectStatus.FirstOrDefault(ws => ws.WorkflowId == 1 && ws.StatusId == 1);
            if (workflowStatus == null)
            {
                var status = workflowStatus?.Status ?? EntityHelper.CreateProjectStatus("Draft", "DR");
                var workflow = workflowStatus?.Workflow ?? EntityHelper.CreateWorkflow(id, "Submit", "SUBMIT-DISPOSAL", new[] { status });
                workflowStatus ??= workflow.Status.First();
            }

            var tierLevel = context.TierLevels.FirstOrDefault(s => s.Id == 1) ?? EntityHelper.CreateTierLevel("tierLevel");

            var project = EntityHelper.CreateProject(id, agency, tierLevel, workflowStatus, risk);
            context.Projects.Add(project);
            return project;
        }

        /// <summary>
        /// Create a new List with new instances of Projects.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="agency"></param>
        /// <param name="workflowStatus"></param>
        /// <param name="risk"></param>
        /// <returns></returns>
        public static List<Entity.Project> CreateProjects(this PimsContext context, int startId, int count, Entity.Agency agency = null, Entity.WorkflowProjectStatus workflowStatus = null, Entity.ProjectRisk risk = null)
        {
            agency ??= context.Agencies.FirstOrDefault(a => a.Id == 1) ?? EntityHelper.CreateAgency(startId);
            risk ??= context.ProjectRisks.FirstOrDefault() ?? EntityHelper.CreateProjectRisk(1, "risk", "risk", 1);
            workflowStatus ??= context.WorkflowProjectStatus.FirstOrDefault(ws => ws.WorkflowId == 1 && ws.StatusId == 1);
            if (workflowStatus == null)
            {
                var status = workflowStatus?.Status ?? EntityHelper.CreateProjectStatus("Draft", "DR");
                var workflow = workflowStatus?.Workflow ?? EntityHelper.CreateWorkflow(startId, "Submit", "SUBMIT-DISPOSAL", new[] { status });
                workflowStatus ??= workflow.Status.First();
            }

            var projects = new List<Entity.Project>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                projects.Add(context.CreateProject(i, agency, workflowStatus, risk));
            }
            return projects;
        }

        /// <summary>
        /// Set the project workflow and status to the specified 'workflowStatus'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="workflowStatus"></param>
        /// <returns></returns>
        public static Entity.Project SetStatus(this Entity.Project project, Entity.WorkflowProjectStatus workflowStatus)
        {
            project.Workflow = workflowStatus.Workflow;
            project.WorkflowId = workflowStatus.WorkflowId;
            project.Status = workflowStatus.Status;
            project.StatusId = workflowStatus.StatusId;
            return project;
        }

        /// <summary>
        /// Set the project workflow and status to the specified 'workflow' and 'status'.
        /// If the status is not part of the specified workflow it will throw an exception.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <param name="workflowCode"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public static PimsContext SetStatus(this PimsContext context, Entity.Project project, string workflowCode, string statusCode)
        {
            var workflow = context.Workflows.First(w => w.Code == workflowCode);
            var status = workflow.Status.First(s => s.Status.Code == statusCode);
            project.SetStatus(status);

            return context;
        }
    }
}
