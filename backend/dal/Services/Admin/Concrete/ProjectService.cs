using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
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
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ProjectService> logger) : base(dbContext, user, service, logger) { }
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
        /// Add the specified project to the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public override Project Add(Project project)
        {
            project.ThrowIfNull(nameof(project));

            if (project.Workflow != null)
                this.Context.Entry(project.Workflow).State = EntityState.Unchanged;
            if (project.Status != null)
                this.Context.Entry(project.Status).State = EntityState.Unchanged;
            if (project.Agency != null)
                this.Context.Entry(project.Agency).State = EntityState.Unchanged;
            if (project.TierLevel != null)
                this.Context.Entry(project.TierLevel).State = EntityState.Unchanged;
            if (project.Risk != null)
                this.Context.Entry(project.Risk).State = EntityState.Unchanged;

            project.Responses.ForEach(r =>
            {
                if (r.Agency != null)
                    this.Context.Entry(r.Agency).State = EntityState.Unchanged;
            });

            project.Tasks.ForEach(t =>
            {
                if (t.Task != null)
                {
                    var task = this.Context.Tasks.Local.FirstOrDefault(ta => ta.Id == t.TaskId);
                    if (task == null)
                        this.Context.Entry(t.Task).State = EntityState.Unchanged;
                    else
                        t.Task = task;
                }
            });

            return base.Add(project);
        }

        /// <summary>
        /// Add the collection of projects to the datasource.
        /// </summary>
        /// <param name="projects"></param>
        /// <returns></returns>
        public IEnumerable<Project> Add(IEnumerable<Project> projects)
        {
            projects.ThrowIfNull(nameof(projects));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            projects.ForEach((project) =>
            {
                if (project == null) throw new ArgumentNullException();

                if (project.Workflow != null)
                    this.Context.Entry(project.Workflow).State = EntityState.Unchanged;
                if (project.Status != null)
                    this.Context.Entry(project.Status).State = EntityState.Unchanged;
                if (project.Agency != null)
                    this.Context.Entry(project.Agency).State = EntityState.Unchanged;
                if (project.TierLevel != null)
                    this.Context.Entry(project.TierLevel).State = EntityState.Unchanged;
                if (project.Risk != null)
                    this.Context.Entry(project.Risk).State = EntityState.Unchanged;

                project.Responses.ForEach(r =>
                {
                    if (r.Agency != null)
                        this.Context.Entry(r.Agency).State = EntityState.Unchanged;
                });

                project.Tasks.ForEach(t =>
                {
                    if (t.Task != null)
                    {
                        var task = this.Context.Tasks.Local.FirstOrDefault(ta => ta.Id == t.TaskId);
                        if (task == null)
                            this.Context.Entry(t.Task).State = EntityState.Unchanged;
                        else
                            t.Task = task;
                    }
                });

                if (project.Id == 0)
                {
                    this.Context.Projects.Add(project);
                }
                else
                {
                    this.Context.Projects.Update(project);
                }
            });

            this.Context.CommitTransaction();
            return projects;
        }

        /// <summary>
        /// Update the specified project in the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override Project Update(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var originalProject = this.Context.Projects.Find(project.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(originalProject).CurrentValues.SetValues(project);

            // TODO: Update child properties appropriately.
            return base.Update(originalProject);
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
