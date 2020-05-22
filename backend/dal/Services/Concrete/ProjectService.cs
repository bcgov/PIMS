using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ProjectService class, provides a service layer to interact with projects within the datasource.
    /// </summary>
    public class ProjectService : BaseService<Project>, IProjectService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public ProjectService(PimsContext dbContext, ClaimsPrincipal user, ILogger<ProjectService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of project status for the specified 'workflow'.
        /// </summary>
        /// <param name="workflow"></param>
        /// <returns></returns>
        public IEnumerable<ProjectStatus> GetWorkflow(string workflow)
        {
            var status = this.Context.ProjectStatus
                .AsNoTracking()
                .OrderBy(s => s.SortOrder)
                .ThenBy(s => s.Name)
                .Where(s => EF.Functions.Like(s.Workflow, $"%{workflow}%"));

            return status.ToArray();
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Project Get(string projectNumber)
        {
            if (String.IsNullOrWhiteSpace(projectNumber)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(projectNumber));
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var project = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Properties)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Fiscals)
                .Include(p => p.Properties).ThenInclude(b => b.Building)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Fiscals)
                .AsNoTracking()
                .FirstOrDefault(p => p.ProjectNumber == projectNumber &&
                    (isAdmin || userAgencies.Contains(p.AgencyId))) ?? throw new KeyNotFoundException();

            // Remove any sensitive properties from the results if the user is not allowed to view them.
            if (!viewSensitive)
            {
                project?.Properties.RemoveAll(p => p.Parcel.IsSensitive);
                project?.Properties.RemoveAll(p => p.Building.IsSensitive);
            }
            return project;
        }

        /// <summary>
        /// Add the specified project to the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public Project Add(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.PropertyAdd);

            var agency = this.User.GetAgency(this.Context) ??
                throw new NotAuthorizedException("User must belong to an agency before adding projects.");

            project.AgencyId = agency.Id; // Always assign the current user's agency to the project.
            project.Agency = agency;
            project.StatusId = 0; // Always start a project as a Draft.
            project.Status = this.Context.ProjectStatus.Find(project.StatusId);
            project.TierLevel = this.Context.TierLevels.Find(project.TierLevelId);

            // If the tasks haven't been specified, generate them.
            if (!project.Tasks.Any())
            {
                var tasks = this.Context.Tasks.Where(t => t.TaskType == TaskTypes.DisposalProjectDocuments);
                foreach (var task in tasks)
                {
                    project.Tasks.Add(new ProjectTask(project, task));
                }
            }

            this.Context.Projects.Add(project);
            this.Context.CommitTransaction();
            return project;
        }

        /// <summary>
        /// Update the specified project in the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Project Update(Project project)
        {
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var existingProject = this.Context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Properties)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Fiscals)
                .Include(p => p.Properties).ThenInclude(b => b.Building)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Fiscals)
                .SingleOrDefault(p => p.ProjectNumber == project.ProjectNumber) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            if (!isAdmin && !userAgencies.Contains(project.AgencyId)) throw new NotAuthorizedException("User may not edit projects outside of their agency.");

            // Do not allow switching agencies through this method.
            if (existingProject.AgencyId != project.AgencyId) throw new NotAuthorizedException("Project cannot be transferred to the specified agency.");

            // Update a project
            this.Context.Entry(existingProject).CurrentValues.SetValues(project); // TODO: Fix concurency issue.

            foreach (var property in project.Properties)
            {
                var existingProperty = existingProject.Properties.FirstOrDefault(b => b.Id == property.Id);

                if (existingProperty == null)
                {
                    existingProject.Properties.Add(property);
                }
                else
                {
                    this.Context.Entry(existingProperty).CurrentValues.SetValues(property);

                    if (property.PropertyType == PropertyTypes.Land)
                    {
                        foreach (var evaluation in property.Parcel.Evaluations)
                        {
                            var existingEvaluation = existingProperty.Parcel.Evaluations
                                .FirstOrDefault(e => e.Date == evaluation.Date && e.Key == evaluation.Key);

                            if (existingEvaluation == null)
                            {
                                existingProperty.Parcel.Evaluations.Add(evaluation);
                            }
                            else
                            {
                                this.Context.Entry(existingEvaluation).CurrentValues.SetValues(evaluation);
                            }
                        }
                        foreach (var fiscal in property.Parcel.Fiscals)
                        {
                            var existingFiscal = existingProperty.Parcel.Fiscals
                                .FirstOrDefault(e => e.FiscalYear == fiscal.FiscalYear && e.Key == fiscal.Key);

                            if (existingFiscal == null)
                            {
                                existingProperty.Parcel.Fiscals.Add(fiscal);
                            }
                            else
                            {
                                this.Context.Entry(existingFiscal).CurrentValues.SetValues(fiscal);
                            }
                        }
                    }
                    else if (property.PropertyType == PropertyTypes.Building)
                    {
                        foreach (var evaluation in property.Building.Evaluations)
                        {
                            var existingEvaluation = existingProperty.Building.Evaluations
                                .FirstOrDefault(e => e.Date == evaluation.Date && e.Key == evaluation.Key);

                            if (existingEvaluation == null)
                            {
                                existingProperty.Building.Evaluations.Add(evaluation);
                            }
                            else
                            {
                                this.Context.Entry(existingEvaluation).CurrentValues.SetValues(evaluation);
                            }
                        }
                        foreach (var fiscal in property.Building.Fiscals)
                        {
                            var existingFiscal = existingProperty.Building.Fiscals
                                .FirstOrDefault(e => e.FiscalYear == fiscal.FiscalYear && e.Key == fiscal.Key);

                            if (existingFiscal == null)
                            {
                                existingProperty.Building.Fiscals.Add(fiscal);
                            }
                            else
                            {
                                this.Context.Entry(existingFiscal).CurrentValues.SetValues(fiscal);
                            }
                        }
                    }
                }
            }

            foreach (var task in project.Tasks)
            {
                var existingTask = existingProject.Tasks.FirstOrDefault(t => t.TaskId == task.TaskId);

                if (existingProject == null)
                {
                    existingProject.Tasks.Add(task);
                }
                else
                {
                    this.Context.Entry(existingTask).CurrentValues.SetValues(task);
                }
            }

            this.Context.SaveChanges();
            this.Context.CommitTransaction();
            return project;
        }

        /// <summary>
        /// Remove the specified project from the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public void Remove(Project project)
        {
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.PropertyDelete, Permissions.AdminProperties });

            var userAgencies = this.User.GetAgencies();
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);
            var existingProject = this.Context.Projects
                .SingleOrDefault(p => p.ProjectNumber == project.ProjectNumber) ?? throw new KeyNotFoundException();

            if (!isAdmin && (!userAgencies.Contains(existingProject.AgencyId)))
                throw new NotAuthorizedException("User does not have permission to delete.");

            this.Context.Entry(existingProject).CurrentValues.SetValues(project);
            existingProject.Tasks.ForEach(task =>
            {
                this.Context.ProjectTasks.Remove(task);
            });
            existingProject.Properties.ForEach(property =>
            {
                this.Context.ProjectProperties.Remove(property);
            });
            this.Context.Projects.Remove(existingProject); // TODO: Shouldn't be allowed to permanently delete projects entirely.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
