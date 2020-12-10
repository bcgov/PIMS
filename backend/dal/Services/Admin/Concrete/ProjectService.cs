using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ProjectService class, provides a service layer to administrate project objects within the datasource.
    /// </summary>
    public class ProjectService : BaseService<Project>, IProjectService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        public ProjectService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, IOptions<PimsOptions> options, ILogger<ProjectService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get the project for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Project Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Responses)
                .FirstOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public Project Get(int id, params Expression<Func<Project, object>>[] includes)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            var query = this.Context.Projects.AsNoTracking();

            return includes.Aggregate(query, (current, include) => current.Include(include.Name))
                .FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public Project Get(string projectNumber)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Responses)
                .Include(p => p.Notes)
                .Include(p => p.Tasks)
                .FirstOrDefault(u => u.ProjectNumber == projectNumber);
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="includes"></param>
        /// <returns></returns>
        public Project Get(string projectNumber, params Expression<Func<Project, object>>[] includes)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            var query = this.Context.Projects.AsNoTracking();

            return includes.Aggregate(query, (current, include) => current.Include(include.Name))
                .FirstOrDefault(u => u.ProjectNumber == projectNumber);
        }

        /// <summary>
        /// Return all the snaphots for the specified 'projectId'.
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public IEnumerable<ProjectSnapshot> GetSnapshots(int projectId)
        {
            return this.Context.ProjectSnapshots
                .Where(s => s.ProjectId == projectId)
                .ToArray();
        }

        /// <summary>
        /// Generate a new project number.
        /// This does not apply the generated number to a project, this is up to you to do.
        /// </summary>
        /// <returns></returns>
        public string GenerateProjectNumber()
        {
            var projectNumber = this.Context.GenerateProjectNumber(_options.Project.NumberFormat);
            return projectNumber;
        }

        /// <summary>
        /// Apply the specified 'projectNumber' to the specified 'project' and update all properties associated with it.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public void UpdateProjectNumber(Project project, string projectNumber)
        {
            this.Context.UpdateProjectNumber(project, projectNumber);
            this.Context.SaveChanges();
        }

        /// <summary>
        /// Add the specified project to the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public override void Add(Project project)
        {
            project.ThrowIfNull(nameof(project));

            project.Workflow = null;
            project.Status = null;
            project.Agency = null;
            project.TierLevel = null;
            project.Risk = null;

            project.Responses.ForEach(r =>
            {
                r.Agency = null;
            });

            project.Tasks.ForEach(t =>
            {
                t.Task = null;
            });

            base.Add(project);
        }

        /// <summary>
        /// Add the collection of projects to the datasource.
        /// </summary>
        /// <param name="projects"></param>
        /// <returns></returns>
        public void Add(IEnumerable<Project> projects)
        {
            projects.ThrowIfNull(nameof(projects));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (projects.Any())
            {
                projects.ForEach((project) =>
                {
                    if (project == null) return;

                    if (String.IsNullOrWhiteSpace(project.ProjectNumber))
                    {
                        project.ProjectNumber = $"TEMP-{DateTime.UtcNow.Ticks:00000}";
                    }

                    this.Context.Projects.Add(project);
                });

                this.Context.CommitTransaction();
            }
        }

        /// <summary>
        /// Update the specified project in the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var originalProject = this.Context.Projects.Find(project.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(originalProject).CurrentValues.SetValues(project);

            // TODO: Update child properties appropriately.
            base.Update(originalProject);
        }

        /// <summary>
        /// Update the collection of projects in the datasource.
        /// </summary>
        /// <param name="projects"></param>
        /// <returns></returns>
        public void Update(IEnumerable<Project> projects)
        {
            projects.ThrowIfNull(nameof(projects));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (projects.Any())
            {
                projects.ForEach((project) =>
                {
                    if (project == null) throw new ArgumentNullException();

                    project.Workflow = project.Workflow != null ? this.Context.Workflows.Find(project.WorkflowId) : null;
                    project.Status = project.Status != null ? this.Context.ProjectStatus.Find(project.StatusId) : null;
                    project.Agency = project.Agency != null ? this.Context.Agencies.Find(project.AgencyId) : null;
                    project.TierLevel = project.TierLevel != null ? this.Context.TierLevels.Find(project.TierLevelId) : null;
                    project.Risk = project.Risk != null ? this.Context.ProjectRisks.Find(project.RiskId) : null;

                    project.Responses.ForEach(r =>
                    {
                        r.Agency = r.Agency != null ? this.Context.Agencies.Find(r.AgencyId) : null;
                    });

                    project.Tasks.ForEach(t =>
                    {
                        t.Task = t.Task != null ? this.Context.Tasks.Find(t.TaskId) : null;
                    });

                    this.Context.Projects.Update(project);
                });

                this.Context.CommitTransaction();
            }    
        }

        /// <summary>
        /// Remove the specified project from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="project"></param>
        public override void Remove(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var originalProject = this.Context.Projects.Find(project.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(originalProject).CurrentValues.SetValues(project);
            base.Remove(originalProject);
        }
        #endregion
    }
}
