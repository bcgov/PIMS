using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
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
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public ProjectService(PimsContext dbContext, ClaimsPrincipal user, IOptions<PimsOptions> options, ILogger<ProjectService> logger) : base(dbContext, user, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page with an array of projects within the specified filters.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Project> GetPage(ProjectFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var query = this.Context.GenerateQuery(this.User, filter);
            var total = query.Count();
            var items = query
                .Skip((filter.Page - 1) * filter.Quantity)
                .Take(filter.Quantity)
                .ToArray();

            return new Paged<Project>(items, filter.Page, filter.Quantity, total);
        }

        /// <summary>
        /// Get the project for the specified 'id'.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Project Get(int id)
        {
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
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Status)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Fiscals)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Classification)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Address)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Address).ThenInclude(a => a.City)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Agency)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Status)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Fiscals)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Classification)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Address)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Address).ThenInclude(a => a.City)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Agency)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.BuildingOccupantType)
                .Include(p => p.Properties).ThenInclude(p => p.Building).ThenInclude(b => b.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == id &&
                    (isAdmin || userAgencies.Contains(p.AgencyId))) ?? throw new KeyNotFoundException();

            // Remove any sensitive properties from the results if the user is not allowed to view them.
            if (!viewSensitive)
            {
                project?.Properties.RemoveAll(p => p.Parcel?.IsSensitive ?? false);
                project?.Properties.RemoveAll(p => p.Building?.IsSensitive ?? false);
            }
            return project;
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
                .FirstOrDefault(p => p.ProjectNumber == projectNumber &&
                    (isAdmin || userAgencies.Contains(p.AgencyId))) ?? throw new KeyNotFoundException();

            //The following reduces the load on the database compared to eager loading all parcel/building props.
            this.Context.Entry(project)
                .Collection(p => p.Properties)
                .Load();
            foreach(ProjectProperty pp in project.Properties)
            {
                if(pp.PropertyType == PropertyTypes.Land)
                {
                    this.Context.Entry(pp)
                    .Reference(p => p.Parcel).Query()
                    .Include(p => p.Status)
                    .Include(p => p.Evaluations)
                    .Include(p => p.Fiscals)
                    .Include(p => p.Classification)
                    .Include(p => p.Address)
                    .Include(p => p.Address).ThenInclude(a => a.City)
                    .Include(p => p.Address).ThenInclude(a => a.Province)
                    .Include(p => p.Agency)
                    .Include(p => p.Agency).ThenInclude(a => a.Parent)
                    .Load();
                } else
                {
                    this.Context.Entry(pp)
                    .Reference(p => p.Building).Query()
                    .Include(b => b.Parcel)
                    .Include(b => b.Status)
                    .Include(b => b.Evaluations)
                    .Include(p => p.Fiscals)
                    .Include(b => b.Classification)
                    .Include(b => b.Address)
                    .Include(b => b.Address).ThenInclude(a => a.City)
                    .Include(b => b.Address).ThenInclude(a => a.Province)
                    .Include(b => b.Agency)
                    .Include(b => b.Agency).ThenInclude(a => a.Parent)
                    .Include(b => b.BuildingConstructionType)
                    .Include(b => b.BuildingOccupantType)
                    .Include(b => b.BuildingPredominateUse)
                    .Load();
                }
            }

            // Remove any sensitive properties from the results if the user is not allowed to view them.
            if (!viewSensitive)
            {
                project?.Properties.RemoveAll(p => p.Parcel?.IsSensitive ?? false);
                project?.Properties.RemoveAll(p => p.Building?.IsSensitive ?? false);
            }
            this.Context.Entry(project).State = EntityState.Detached;
            return project;
        }

        /// <summary>
        /// Add the specified project to the datasource.
        /// All projects start with the default status (i.e. 1:DRAFT).
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public Project Add(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.PropertyAdd);

            var agency = this.User.GetAgency(this.Context) ??
                throw new NotAuthorizedException("User must belong to an agency before adding projects.");

            if (String.IsNullOrWhiteSpace(project.Name)) throw new ArgumentException("Project name is required and cannot be null, empty or whitespace.", nameof(project));

            var status = this.Context.ProjectStatus
                .Include(s => s.Tasks)
                .ThenInclude(t => t.Task)
                .FirstOrDefault(s => s.Id == 1) ?? throw new KeyNotFoundException("The default project status could not be found.");

            project.ProjectNumber = $"TEMP-{DateTime.UtcNow.Ticks:00000}"; // Temporary project number.
            project.AgencyId = agency.Id; // Always assign the current user's agency to the project.
            project.Agency = agency;
            project.StatusId = 0; // Always start a project as a Draft.
            project.Status = status;
            project.TierLevel = this.Context.TierLevels.Find(project.TierLevelId);

            // If the tasks haven't been specified, generate them.
            var taskIds = project.Tasks.Select(t => t.TaskId).ToArray();
            // Add the tasks for project status.
            foreach (var task in status.Tasks.Where(t => !taskIds.Contains(t.TaskId)))
            {
                project.Tasks.Add(new ProjectTask(project, task.Task));
            }

            this.Context.Projects.Add(project);
            this.Context.CommitTransaction();

            // Update the project number with the identity.
            project.ProjectNumber = String.Format(_options.Project.DraftFormat, project.Id);

            // Update all properties with the new project number.
            var parcelIds = project.Properties.Where(p => p.ParcelId != null).Select(p => p.ParcelId.Value).ToArray();
            if (parcelIds.Any())
            {
                var parcels = this.Context.Parcels.Where(p => parcelIds.Contains(p.Id));
                parcels.ForEach(p => p.ProjectNumber = project.ProjectNumber);
            }
            var buildingIds = project.Properties.Where(b => b.BuildingId != null).Select(b => b.BuildingId.Value).ToArray();
            if (buildingIds.Any())
            {
                var buildings = this.Context.Buildings.Where(b => buildingIds.Contains(b.Id));
                buildings.ForEach(b => b.ProjectNumber = project.ProjectNumber);
            }

            this.Context.Projects.Update(project);
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
            project.ThrowIfNull(nameof(project));
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            if (String.IsNullOrWhiteSpace(project.Name)) throw new ArgumentException("Project name is required and cannot be null, empty or whitespace.", nameof(project));

            var originalProject = this.Context.Projects
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Properties)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Status)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Evaluations)
                .Include(p => p.Properties).ThenInclude(p => p.Parcel).ThenInclude(p => p.Fiscals)
                .Include(p => p.Properties).ThenInclude(b => b.Building)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Parcel)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Properties).ThenInclude(b => b.Building).ThenInclude(b => b.Fiscals)
                .SingleOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            var originalAgencyId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.AgencyId)];
            if (!isAdmin && !userAgencies.Contains(originalAgencyId)) throw new NotAuthorizedException("User may not edit projects outside of their agency.");

            // Do not allow switching agencies through this method.
            if (originalAgencyId != project.AgencyId) throw new NotAuthorizedException("Project cannot be transferred to the specified agency.");

            // Not allowed to change the project number.
            var originalProjectNumber = (string)this.Context.Entry(originalProject).OriginalValues[nameof(Project.ProjectNumber)];
            if (originalProjectNumber != project.ProjectNumber) throw new InvalidOperationException("Project number cannot be changed.");

            // Only allow valid non-milestone project status transitions.
            var fromStatusId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.StatusId)];
            if (fromStatusId != project.StatusId)
            {
                var fromStatus = this.Context.ProjectStatus
                    .Include(s => s.ToStatus)
                    .FirstOrDefault(s => s.Id == fromStatusId);
                var toStatus = this.Context.ProjectStatus.Find(project.StatusId);
                if (toStatus.IsMilestone) throw new InvalidOperationException($"Project status transitions from '{fromStatus.Name}' to '{toStatus?.Name}' requires a milestone transition.");
                if (!fromStatus.ToStatus.Any(s => s.ToStatusId == project.StatusId)) throw new InvalidOperationException($"Invalid project status transitions from '{fromStatus.Name}' to '{toStatus?.Name}'.");
            }

            // Update a project
            this.Context.Entry(originalProject).CurrentValues.SetValues(project); // TODO: Fix concurency issue.
            this.Context.SetOriginalRowVersion(originalProject);

            foreach (var property in project.Properties)
            {
                var existingProperty = originalProject.Properties.FirstOrDefault(b => b.PropertyType == PropertyTypes.Land
                && b.ParcelId == property.ParcelId
                && b.ProjectId == project.Id
                ||
                b.PropertyType == PropertyTypes.Building
                && b.ProjectId == project.Id
                && b.BuildingId == property.BuildingId);

                if (existingProperty == null)
                {
                    //Todo: Navigation properties on project object were causing concurrency exceptions.
                    var eproperty = property.PropertyType == PropertyTypes.Land ? this.Context.Parcels.Find(property.ParcelId) : this.Context.Buildings.Find(property.BuildingId) as Property;
                    // Ignore properties that don't exist.
                    if (eproperty != null) originalProject.AddProperty(eproperty);
                }
                else
                {
                    if (property.PropertyType == PropertyTypes.Land)
                    {
                        // Only allow editing the classification and evaluations/fiscals for now
                        existingProperty.Parcel.ProjectNumber = originalProjectNumber;
                        existingProperty.Parcel.ClassificationId = property.Parcel.ClassificationId;
                        existingProperty.Parcel.Zoning = property.Parcel.Zoning;
                        existingProperty.Parcel.ZoningPotential = property.Parcel.ZoningPotential;
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
                        // Only allow editing the classification and evaluations/fiscals for now
                        existingProperty.Building.ProjectNumber = originalProjectNumber;
                        existingProperty.Building.ClassificationId = property.Building.ClassificationId;
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

            // Remove any properties from this project that are no longer associated.
            var removePropertyIds = originalProject.Properties.Select(p => p.Id).Except(project.Properties.Select(p => p.Id));
            var removeProperties = originalProject.Properties.Where(p => removePropertyIds.Contains(p.Id));

            var removeParcelIds = removeProperties.Select(p => p.ParcelId.Value).ToArray();
            var removeParcels = this.Context.Parcels.Where(p => removeParcelIds.Contains(p.Id));
            removeParcels.ForEach(p =>
            {
                p.ProjectNumber = null;
                this.Context.Parcels.Update(p);
            });

            var removeBuildingIds = removeProperties.Select(p => p.BuildingId.Value).ToArray();
            var removeBuildings = this.Context.Buildings.Where(p => removeBuildingIds.Contains(p.Id));
            removeBuildings.ForEach(b =>
            {
                b.ProjectNumber = null;
                this.Context.Buildings.Update(b);
            });

            originalProject.Properties.RemoveAll(p => removePropertyIds.Contains(p.Id));

            foreach (var task in project.Tasks)
            {
                var originalProjectTask = originalProject.Tasks.FirstOrDefault(t => t.TaskId == task.TaskId);

                if (originalProjectTask == null)
                {
                    originalProject.Tasks.Add(task);
                }
                else
                {
                    this.Context.Entry(originalProjectTask).CurrentValues.SetValues(task);
                }
            }

            var status = this.Context.ProjectStatus
                .Include(s => s.Tasks)
                .ThenInclude(t => t.Task)
                .FirstOrDefault(s => s.Id == project.StatusId);

            // If the tasks haven't been specified, generate them.
            var taskIds = project.Tasks.Select(t => t.TaskId).ToArray();
            // Add the tasks for project status if they are not already added.
            foreach (var task in status.Tasks.Where(t => !taskIds.Contains(t.TaskId)))
            {
                project.Tasks.Add(new ProjectTask(project, task.Task));
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
            var originalProject = this.Context.Projects
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .Include(p => p.Tasks)
                .SingleOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            if (!isAdmin && (!userAgencies.Contains(originalProject.AgencyId)))
                throw new NotAuthorizedException("User does not have permission to delete.");

            this.Context.Entry(originalProject).CurrentValues.SetValues(project);
            this.Context.SetOriginalRowVersion(originalProject);

            originalProject.Tasks.ForEach(t =>
            {
                this.Context.ProjectTasks.Remove(t);
            });
            originalProject.Properties.ForEach(p =>
            {
                this.Context.Update(p.UpdateProjectNumber(null));

                this.Context.ProjectProperties.Remove(p);
            });
            this.Context.Projects.Remove(originalProject); // TODO: Shouldn't be allowed to permanently delete projects entirely.
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Change the status of the project.
        /// Only valid transitions are allowed.
        /// Use this method to transition to milestone project statuses.
        /// Peforms additional logic on milestone transitions.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="workflowCode"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public Project SetStatus(Project project, string workflowCode, string statusCode)
        {
            var workflow = this.Context.Workflows
                .Include(w => w.Status)
                .ThenInclude(s => s.Status)
                .FirstOrDefault(w => w.Code == workflowCode) ?? throw new KeyNotFoundException();
            var status = workflow.Status.FirstOrDefault(s => s.Status.Code == statusCode)?.Status ?? throw new KeyNotFoundException();

            return SetStatus(project, workflow, status);
        }

        /// <summary>
        /// Change the status of the project.
        /// Only valid transitions are allowed.
        /// Use this method to transition to milestone project statuses.
        /// Peforms additional logic on milestone transitions.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="workflow"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public Project SetStatus(Project project, Workflow workflow, ProjectStatus status)
        {
            if (project == null) throw new ArgumentNullException(nameof(project));
            if (workflow == null) throw new ArgumentNullException(nameof(workflow));
            if (status == null) throw new ArgumentNullException(nameof(status));

            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var originalProject = this.Context.Projects
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .FirstOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            if (!isAdmin && !userAgencies.Contains(originalProject.AgencyId)) throw new NotAuthorizedException("User may not edit projects outside of their agency.");

            // Only allow valid project status transitions.
            var fromStatusId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.StatusId)];
            var fromStatus = this.Context.ProjectStatus
                .Include(s => s.ToStatus)
                .FirstOrDefault(s => s.Id == fromStatusId);
            var toStatus = this.Context.ProjectStatus.Find(status.Id);
            if (!fromStatus.ToStatus.Any(s => s.ToStatusId == project.StatusId)) throw new InvalidOperationException($"Invalid project status transitions from '{fromStatus.Name}' to '{toStatus?.Name}'.");

            // Hardcoded logic to handle milestone project status transitions.
            // This could be extracted at some point to a configurable layer, but not required presently.
            switch (toStatus.Code)
            {
                case ("SU"): // Submit
                    // This must be done first because it requires its own transaction.
                    var projectNumber = this.Context.GenerateProjectNumber(_options.Project.NumberFormat);
                    this.Context.UpdateProjectNumber(originalProject, projectNumber);
                    originalProject.SubmittedOn = DateTime.UtcNow;
                    break;
                case ("AP-ERP"): // Approve for ERP
                case ("AP-SPL"): // Approve for SPL
                    originalProject.ApprovedOn = DateTime.UtcNow;
                    break;
                case ("DE"): // Deny
                    // Remove ProjectNumber from properties.
                    originalProject.Properties.ForEach(p =>
                    {
                        this.Context.Update(p.UpdateProjectNumber(null));
                    });
                    originalProject.DeniedOn = DateTime.UtcNow;
                    break;
            }

            // Update a project
            originalProject.StatusId = status.Id;
            originalProject.Status = status;
            project.CopyRowVersionTo(originalProject);
            this.Context.CommitTransaction();

            return originalProject;
        }
        #endregion
    }
}
