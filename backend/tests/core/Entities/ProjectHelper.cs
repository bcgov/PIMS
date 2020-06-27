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
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(int id, Entity.Agency agency = null, Entity.ProjectStatus status = null)
        {
            agency ??= EntityHelper.CreateAgency(id);
            status ??= EntityHelper.CreateProjectStatus("Draft", "DR");
            var tierLevel = EntityHelper.CreateTierLevel("tierLevel");

            var user = CreateUser(Guid.NewGuid(), "project tester", "asasa", "asasa", null, agency);
            return new Entity.Project($"SPP-{id:00000}", $"test-{id}", tierLevel)
            {
                FiscalYear = DateTime.UtcNow.GetFiscalYear(),
                Agency = agency,
                AgencyId = agency.Id,
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
                AgencyResponseNote = $"agencyResponseNote-{id}",
                UpdatedOn = DateTime.UtcNow,
                SubmittedOn = DateTime.UtcNow,
                ApprovedOn = DateTime.UtcNow,
                DeniedOn = DateTime.UtcNow,
                CancelledOn = DateTime.UtcNow,
                InitialNotificationSentOn = DateTime.UtcNow,
                ThirtyDayNotificationSentOn = DateTime.UtcNow,
                SixtyDayNotificationSentOn = DateTime.UtcNow,
                NinetyDayNotificationSentOn = DateTime.UtcNow,
                OnHoldNotificationSentOn = DateTime.UtcNow,
                ClearanceNotificationSentOn = DateTime.UtcNow,
                TransferredWithinGreOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of Projects.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <param name="agency"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static List<Entity.Project> CreateProjects(int startId, int count, Entity.Agency agency = null, Entity.ProjectStatus status = null)
        {
            var projects = new List<Entity.Project>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                projects.Add(CreateProject(i, agency, status));
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
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Project CreateProject(this PimsContext context, int id, Entity.Agency agency = null, Entity.ProjectStatus status = null)
        {
            agency ??= context.Agencies.OrderBy(a => a.Id).FirstOrDefault() ?? EntityHelper.CreateAgency(1);
            status ??= context.ProjectStatus.FirstOrDefault(s => s.Id == 1) ?? EntityHelper.CreateProjectStatus("Draft", "DR");
            var tierLevel = context.TierLevels.FirstOrDefault(s => s.Id == 1) ?? EntityHelper.CreateTierLevel("tierLevel");

            var project = new Entity.Project($"SPP-{id:00000}", $"test-{id}", tierLevel)
            {
                FiscalYear = DateTime.UtcNow.GetFiscalYear(),
                Agency = agency,
                AgencyId = agency.Id,
                Description = $"description-{id}",
                Status = status,
                StatusId = status.Id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
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
        /// <param name="status"></param>
        /// <returns></returns>
        public static List<Entity.Project> CreateProjects(this PimsContext context, int startId, int count, Entity.Agency agency = null, Entity.ProjectStatus status = null)
        {
            agency ??= context.Agencies.FirstOrDefault(a => a.Id == 1) ?? EntityHelper.CreateAgency(startId);
            status ??= context.ProjectStatus.FirstOrDefault(s => s.Id == 1) ?? EntityHelper.CreateProjectStatus("Draft", "DR");

            var projects = new List<Entity.Project>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                projects.Add(context.CreateProject(i, agency, status));
            }
            return projects;
        }

        /// <summary>
        /// Change the status of the project.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        public static Entity.Project ChangeStatus(this PimsContext context, Entity.Project project, int statusId)
        {
            project.StatusId = statusId;
            project.Status = context.ProjectStatus.First(s => s.Id == statusId);
            return project;
        }

        /// <summary>
        /// Change the status of the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        public static Entity.Project ChangeStatus(this Entity.Project project, Entity.ProjectStatus status)
        {
            project.Status = status;
            project.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
            return project;
        }
    }
}
