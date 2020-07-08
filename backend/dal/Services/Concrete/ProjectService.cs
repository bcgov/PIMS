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
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, IOptions<PimsOptions> options, ILogger<ProjectService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get the total number of projects in the datasource.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return this.Context.Projects.Count();
        }

        /// <summary>
        /// Get a page with an array of projects within the specified filters.
        /// </summary>
        /// <param name="filter"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view projects.</exception>
        /// <returns></returns>
        public Paged<Project> GetPage(ProjectFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var query = this.Context.GenerateQuery(this.User, filter, _options.Project);
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
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view project.</exception>
        /// <returns></returns>
        public Project Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProjects);

            var project = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Tasks).ThenInclude(t => t.Task).ThenInclude(t => t.Status)
                .Include(p => p.Responses)
                .Include(p => p.Responses).ThenInclude(a => a.Agency)
                .Include(p => p.Notes)
                .Include(p => p.Workflow)
                .FirstOrDefault(p => p.Id == id &&
                    (isAdmin || userAgencies.Contains(p.AgencyId))) ?? throw new KeyNotFoundException();

            //The following reduces the load on the database compared to eager loading all parcel/building props.
            this.Context.Entry(project)
                .Collection(p => p.Properties)
                .Load();
            foreach (ProjectProperty pp in project.Properties)
            {
                if (pp.PropertyType == PropertyTypes.Land)
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
                }
                else
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
            return project;
        }

        /// <summary>
        /// Get the project for the specified 'projectNumber'.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view project.</exception>
        /// <returns></returns>
        public Project Get(string projectNumber)
        {
            if (String.IsNullOrWhiteSpace(projectNumber)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(projectNumber));
            this.User.ThrowIfNotAuthorized(Permissions.ProjectView);

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProjects);

            var project = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Tasks).ThenInclude(t => t.Task).ThenInclude(t => t.Status)
                .Include(p => p.Responses)
                .Include(p => p.Responses).ThenInclude(a => a.Agency)
                .Include(p => p.Notes)
                .Include(p => p.Workflow)
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
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="ArgumentException">Argument 'project.Name' is required.</exception>
        /// <exception cref="KeyNotFoundException">Default status does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to add project.</exception>
        /// <returns></returns>
        public Project Add(Project project)
        {
            project.ThrowIfNull(nameof(project));
            this.User.ThrowIfNotAuthorized(Permissions.ProjectAdd);

            var agency = this.User.GetAgency(this.Context) ??
                throw new NotAuthorizedException("User must belong to an agency before adding projects.");

            if (String.IsNullOrWhiteSpace(project.Name)) throw new ArgumentException("Project name is required and cannot be null, empty or whitespace.", nameof(project));

            var workflow = this.Context.Workflows
                .Include(w => w.Status)
                .FirstOrDefault(w => w.Id == 1) ?? throw new KeyNotFoundException("The default workflow could not be found."); // TODO: The default should be based on configuration for a project type.

            // First status from the workflow. // TODO: The workflow should specify the first status, as this could return a random status.
            var status = workflow.Status.OrderBy(s => s.SortOrder).FirstOrDefault() ?? throw new ConfigurationException($"The workflow '{workflow.Name}' status have not been configured.");

            project.ProjectNumber = $"TEMP-{DateTime.UtcNow.Ticks:00000}"; // Temporary project number.
            project.AgencyId = agency.Id; // Always assign the current user's agency to the project.
            project.Agency = agency;
            project.TierLevel = this.Context.TierLevels.Find(project.TierLevelId);
            project.ReportedFiscalYear = project.ReportedFiscalYear <= 0 ? DateTime.UtcNow.GetFiscalYear() : project.ReportedFiscalYear;
            project.ActualFiscalYear = project.ReportedFiscalYear;
            project.WorkflowId = workflow.Id;
            project.Workflow = workflow;
            project.StatusId = status.StatusId;
            project.Status = status.Status;

            // If the tasks haven't been specified, generate them.
            var taskIds = project.Tasks.Select(t => t.TaskId).ToArray();

            // Add the tasks for project status.
            foreach (var projectStatus in this.Context.ProjectStatus.Include(s => s.Tasks).ToArray())
            {
                foreach (var task in projectStatus.Tasks.Where(t => !taskIds.Contains(t.Id)))
                {
                    project.Tasks.Add(new ProjectTask(project, task));
                }
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

            // Update project financials.
            project.UpdateProjectFinancials();

            this.Context.Projects.Update(project);
            this.Context.CommitTransaction();
            return project;
        }

        /// <summary>
        /// Update the specified project in the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="ArgumentException">Argument 'project.Name' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="InvalidOperationException">Project number cannot be changed.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit project.</exception>
        /// <exception cref="NotAuthorizedException">Project cannot be transfered to another agency.</exception>
        /// <returns></returns>
        public Project Update(Project project)
        {
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.ProjectEdit, Permissions.AdminProjects });
            var isAdmin = this.User.HasPermission(Permissions.AdminProjects);

            if (String.IsNullOrWhiteSpace(project.Name)) throw new ArgumentException("Project name is required and cannot be null, empty or whitespace.", nameof(project));

            var originalProject = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.Agency)
                .Include(p => p.Tasks)
                .Include(p => p.Tasks).ThenInclude(t => t.Task)
                .Include(p => p.Responses)
                .Include(p => p.Workflow)
                .SingleOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            //The following reduces the load on the database compared to eager loading all parcel/building props.
            this.Context.Entry(originalProject)
                .Collection(p => p.Properties)
                .Load();
            foreach (ProjectProperty pp in originalProject.Properties)
            {
                if (pp.PropertyType == PropertyTypes.Land)
                {
                    this.Context.Entry(pp)
                    .Reference(p => p.Parcel).Query()
                    .Include(p => p.Status)
                    .Include(p => p.Evaluations)
                    .Include(p => p.Fiscals)
                    .Load();
                }
                else
                {
                    this.Context.Entry(pp)
                    .Reference(p => p.Building).Query()
                    .Include(b => b.Parcel)
                    .Include(b => b.Status)
                    .Include(b => b.Evaluations)
                    .Include(p => p.Fiscals)
                    .Load();
                }
            }

            var userAgencies = this.User.GetAgencies();
            var originalAgencyId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.AgencyId)];
            if (!isAdmin && !userAgencies.Contains(originalAgencyId)) throw new NotAuthorizedException("User may not edit projects outside of their agency.");

            // If the user isn't allowed to update the project, just update the notes.
            if (!this.IsAllowedToUpdate(originalProject, _options.Project) && !originalProject.IsProjectInDraft(_options.Project) && !originalProject.IsProjectClosed())
            {
                originalProject.Note = project.Note;
                originalProject.PublicNote = project.PublicNote;
                this.Context.SaveChanges();
                this.Context.CommitTransaction();
                return Get(originalProject.Id);
            }
            else
            {
                this.ThrowIfNotAllowedToUpdate(originalProject, _options.Project);
            }

            // Do not allow switching agencies through this method.
            if (originalAgencyId != project.AgencyId) throw new NotAuthorizedException("Project cannot be transferred to the specified agency.");

            // Not allowed to change the project number.
            var originalProjectNumber = (string)this.Context.Entry(originalProject).OriginalValues[nameof(Project.ProjectNumber)];
            if (originalProjectNumber != project.ProjectNumber) throw new InvalidOperationException("Project number cannot be changed.");

            // Only allow valid non-milestone project status transitions.
            var fromStatusId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.StatusId)];
            if (fromStatusId != project.StatusId)
            {
                var fromStatus = this.Context.WorkflowProjectStatus
                    .Include(s => s.Status)
                    .ThenInclude(s => s.Tasks)
                    .Include(s => s.ToStatus)
                    .FirstOrDefault(s => s.WorkflowId == originalProject.WorkflowId && s.StatusId == fromStatusId);
                var toStatus = this.Context.ProjectStatus
                    .Include(s => s.Tasks)
                    .FirstOrDefault(s => s.Id == project.StatusId);
                if (toStatus.IsMilestone) throw new InvalidOperationException($"Project status transitions from '{fromStatus.Status.Name}' to '{toStatus?.Name}' requires a milestone transition.");
                if (!fromStatus.ToStatus.Any(s => s.ToStatusId == project.StatusId)) throw new InvalidOperationException($"Invalid project status transitions from '{fromStatus.Status.Name}' to '{toStatus?.Name}'.");

                // Validate that all required tasks have been completed for the current status before allowing transition from one status to another.
                var incompleteTaskIds = project.Tasks.Where(t => t.IsCompleted == false).Select(t => t.TaskId);
                var statusTaskIds = fromStatus.Status.Tasks.Select(t => t.Id);
                var incompleteStatusTaskIds = incompleteTaskIds.Intersect(statusTaskIds);
                if (originalProject.Tasks.Any(t => !t.Task.IsOptional && !t.IsCompleted && incompleteStatusTaskIds.Contains(t.TaskId))) throw new InvalidOperationException("Not all required tasks have been completed.");
            }

            originalProject.Merge(project, this.Context);

            this.Context.SaveChanges();
            this.Context.CommitTransaction();
            return Get(originalProject.Id);
        }

        /// <summary>
        /// Remove the specified project from the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to delete project.</exception>
        /// <returns></returns>
        public void Remove(Project project)
        {
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.ProjectDelete, Permissions.AdminProjects });

            var userAgencies = this.User.GetAgencies();
            var isAdmin = this.User.HasPermission(Permissions.AdminProjects);
            var originalProject = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .Include(p => p.Tasks)
                .Include(p => p.Workflow)
                .SingleOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            if (!project.IsProjectInDraft(_options.Project))
            {
                this.ThrowIfNotAllowedToUpdate(originalProject, _options.Project);
            }

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
            this.Context.Projects.Remove(originalProject);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Change the status of the project.
        /// Only valid transitions are allowed.
        /// Use this method to transition to milestone project statuses.
        /// Peforms additional logic on milestone transitions.
        /// Make sure you set the specified 'project' status to the destination status you want.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="workflowCode"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="ArgumentNullException">Argument 'workflow' is required.</exception>
        /// <exception cref="ArgumentNullException">Argument 'status' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit project.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to submit request.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to approve request.</exception>
        /// <exception cref="InvalidOperationException">Invalid project status transition.</exception>
        /// <exception cref="InvalidOperationException">Denying a project requires a reason to be included in the shared note.</exception>
        /// <returns></returns>
        public Project SetStatus(Project project, string workflowCode)
        {
            var workflow = this.Context.Workflows
                .Include(w => w.Status)
                .ThenInclude(s => s.Status)
                .FirstOrDefault(w => w.Code == workflowCode) ?? throw new KeyNotFoundException();

            return SetStatus(project, workflow);
        }

        /// <summary>
        /// Change the status of the project.
        /// Only valid transitions are allowed.
        /// Use this method to transition to milestone project statuses.
        /// Peforms additional logic on milestone transitions.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="workflow"></param>
        /// <exception cref="ArgumentNullException">Argument 'project' is required.</exception>
        /// <exception cref="ArgumentNullException">Argument 'workflow' is required.</exception>
        /// <exception cref="ArgumentNullException">Argument 'status' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="KeyNotFoundException">Project status does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit project.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to submit request.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to approve request.</exception>
        /// <exception cref="InvalidOperationException">Invalid project status transition.</exception>
        /// <exception cref="InvalidOperationException">Denying a project requires a reason to be included in the shared note.</exception>
        /// <returns></returns>
        public Project SetStatus(Project project, Workflow workflow)
        {
            project.ThrowIfNotAllowedToEdit(nameof(project), this.User, new[] { Permissions.ProjectEdit, Permissions.AdminProjects });
            workflow.ThrowIfNull(nameof(workflow));

            var isAdmin = this.User.HasPermission(Permissions.AdminProjects);

            var originalProject = this.Context.Projects
                .Include(p => p.Status)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Parcel)
                .Include(p => p.Properties)
                .ThenInclude(p => p.Building)
                .Include(p => p.Tasks)
                .Include(p => p.Workflow)
                .FirstOrDefault(p => p.Id == project.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            if (!isAdmin && !userAgencies.Contains(originalProject.AgencyId)) throw new NotAuthorizedException("User may not edit projects outside of their agency.");

            // Only allow valid project status transitions.
            var fromStatusId = (int)this.Context.Entry(originalProject).OriginalValues[nameof(Project.StatusId)];
            var fromStatus = this.Context.WorkflowProjectStatus
                .Include(s => s.ToStatus)
                .Include(s => s.Status)
                .ThenInclude(s => s.Tasks)
                .FirstOrDefault(s => s.WorkflowId == originalProject.WorkflowId && s.StatusId == fromStatusId) ?? throw new ConfigurationException($"Original workflow '{originalProject.Workflow.Code}' no longer has status '{fromStatusId}'.");
            var toStatus = this.Context.ProjectStatus
                .Include(s => s.Tasks)
                .FirstOrDefault(s => s.Id == project.StatusId) ?? throw new KeyNotFoundException();

            if (fromStatus.StatusId != toStatus.Id)
            {
                var fromWorkflow = fromStatus.ToStatus.FirstOrDefault(s => s.ToStatusId == project.StatusId);
                if (fromWorkflow == null) throw new InvalidOperationException($"Invalid project status transitions from '{fromStatus.Status.Name}' to '{toStatus?.Name}'.");
                project.WorkflowId = fromWorkflow.ToWorkflowId; // Transition to the new workflow if required.

                // TODO: Ideally this would handle scenarios where some tasks would need to be performed for termnating a project.
                if (toStatus.ValidateTasks)
                {
                    // Validate that all required tasks have been completed for the current status before allowing transition from one status to another.
                    var completedTaskIds = project.Tasks.Where(t => t.IsCompleted).Select(t => t.TaskId);
                    var incompleteTaskIds = originalProject.Tasks.Where(t => !t.IsCompleted && !completedTaskIds.Contains(t.TaskId)).Select(t => t.TaskId);
                    var statusTaskIds = fromStatus.Status.Tasks.Where(t => !t.IsOptional).Select(t => t.Id);
                    var incompleteStatusTaskIds = statusTaskIds.Any() && (project.Tasks.Any() || originalProject.Tasks.Any()) ? incompleteTaskIds.Intersect(statusTaskIds) : statusTaskIds;
                    if (incompleteStatusTaskIds.Any()) throw new InvalidOperationException("Not all required tasks have been completed.");
                }
            }

            originalProject.Merge(project, this.Context);

            // Hardcoded logic to handle milestone project status transitions.
            // This could be extracted at some point to a configurable layer, but not required presently.
            switch (toStatus.Code)
            {
                case ("AS-I"): // Review
                case ("AS-EXE"): // Exemption Review
                    this.User.ThrowIfNotAuthorized(Permissions.DisposeRequest, "User does not have permission to submit project.");
                    // This must be done first because it requires its own transaction.
                    var projectNumber = this.Context.GenerateProjectNumber(_options.Project.NumberFormat);
                    this.Context.UpdateProjectNumber(originalProject, projectNumber);
                    originalProject.SubmittedOn = DateTime.UtcNow;
                    break;
                case ("AP-ERP"): // Approve for ERP
                case ("AP-EXE"): // Approve for ERP Exemption
                    this.User.ThrowIfNotAuthorized(Permissions.DisposeApprove, "User does not have permission to approve project.");
                    originalProject.ApprovedOn = DateTime.UtcNow;
                    originalProject.Properties.ForEach(p =>
                    {
                        if (p.BuildingId.HasValue)
                        {
                            p.Building.IsVisibleToOtherAgencies = true;
                            this.Context.Buildings.Update(p.Building);
                        }
                        else if (p.ParcelId.HasValue)
                        {
                            p.Parcel.IsVisibleToOtherAgencies = true;
                            this.Context.Parcels.Update(p.Parcel);
                        }
                    });
                    break;
                case ("AP-SPL"): // Approve for SPL
                    this.User.ThrowIfNotAuthorized(Permissions.DisposeApprove, "User does not have permission to approve project.");
                    if (project.ClearanceNotificationSentOn == null) throw new InvalidOperationException("Approved for SPL status requires Clearance Notification Sent date.");
                    originalProject.ApprovedOn = DateTime.UtcNow;
                    originalProject.Properties.ForEach(p =>
                    {
                        if (p.BuildingId.HasValue)
                        {
                            p.Building.IsVisibleToOtherAgencies = false;
                            this.Context.Buildings.Update(p.Building);
                        }
                        else if (p.ParcelId.HasValue)
                        {
                            p.Parcel.IsVisibleToOtherAgencies = false;
                            this.Context.Parcels.Update(p.Parcel);
                        }
                    });
                    break;
                case ("AP-!SPL"): // Approve for SPL
                    this.User.ThrowIfNotAuthorized(Permissions.DisposeApprove, "User does not have permission to approve project.");
                    if (project.ClearanceNotificationSentOn == null) throw new InvalidOperationException("Not in SPL status requires Clearance Notification Sent date.");
                    originalProject.ApprovedOn = DateTime.UtcNow;
                    originalProject.Properties.ForEach(p =>
                    {
                        if (p.BuildingId.HasValue)
                        {
                            p.Building.IsVisibleToOtherAgencies = false;
                            this.Context.Buildings.Update(p.Building);
                        }
                        else if (p.ParcelId.HasValue)
                        {
                            p.Parcel.IsVisibleToOtherAgencies = false;
                            this.Context.Parcels.Update(p.Parcel);
                        }
                    });
                    break;
                case ("DE"): // Deny
                    // Must have shared note with a reason.
                    if (String.IsNullOrWhiteSpace(project.PublicNote)) throw new InvalidOperationException("Shared note must contain a reason before denying project.");
                    // Remove ProjectNumber from properties.
                    this.Context.ReleaseProjectProperties(originalProject);
                    originalProject.DeniedOn = DateTime.UtcNow;
                    break;
                case ("CA"): // Cancel
                    this.Context.ReleaseProjectProperties(originalProject);
                    originalProject.CancelledOn = DateTime.UtcNow;
                    break;
                case ("ERP-OH"): // OnHold
                    if(project.OnHoldNotificationSentOn == null) throw new InvalidOperationException("On Hold status requires On Hold Notification Sent date.");
                    originalProject.OnHoldNotificationSentOn = project.OnHoldNotificationSentOn;
                    break;
                case ("T-GRE"): // Transferred within the GRE
                    if (project.TransferredWithinGreOn == null) throw new InvalidOperationException("Transferred within GRE status requires Transferred Within GRE date.");
                    originalProject.TransferredWithinGreOn = project.TransferredWithinGreOn;
                    this.Context.TransferProjectProperties(originalProject, project);
                    break;
                default:
                    // All other status changes can only be done by `admin-projects` or when the project is in draft mode.
                    this.ThrowIfNotAllowedToUpdate(originalProject, _options.Project);
                    break;
            }

            // Update a project
            originalProject.StatusId = toStatus.Id;
            originalProject.Status = toStatus;
            project.CopyRowVersionTo(originalProject);
            this.Context.CommitTransaction();

            return Get(originalProject.Id);
        }
        #endregion
    }
}
