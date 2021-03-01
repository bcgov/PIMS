using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ProjectExtensions static class, provides extension methods for projects.
    /// </summary>
    public static class ProjectExtensions
    {
        /// <summary>
        /// Generate a project query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static IQueryable<Entity.Project> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.ProjectFilter filter, ProjectOptions options)
        {
            filter.ThrowIfNull(nameof(user));
            filter.ThrowIfNull(nameof(filter));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = user.GetAgencies();
            var isAdmin = user.HasPermission(Permissions.AdminProjects);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = context.Projects
                .Include(p => p.CreatedBy)
                .Include(p => p.UpdatedBy)
                .Include(p => p.Status)
                .Include(p => p.TierLevel)
                .Include(p => p.Risk)
                .Include(p => p.Agency)
                .Include(p => p.Workflow)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Notes)
                .AsNoTracking();


            if (filter.AssessWorkflow == true)
            {
                var statuses = context.Workflows.Where(w => options.AssessmentWorkflows.Contains(w.Code))
                    .SelectMany(w => w.Status).Select(x => x.StatusId).Distinct().ToArray();
                query = query.Where(p => statuses.Contains(p.StatusId) || p.Status.Code.Equals("AS-I") || p.Status.Code.Equals("AS-EXE")); // TODO: Need optional Status paths within Workflows.
            }

            if (filter.SPLWorkflow == true)
            {
                query = query.Where(p => p.Workflow.Code == "SPL" && p.Status.Code != "CA");
            }

            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"%{filter.ProjectNumber}%"));
            if (!String.IsNullOrWhiteSpace(filter.Name))
                query = query.Where(p => EF.Functions.Like(p.Name, $"%{filter.Name}%") || EF.Functions.Like(p.ProjectNumber, $"%{filter.Name}%"));
            if (filter.TierLevelId.HasValue)
                query = query.Where(p => p.TierLevelId == filter.TierLevelId);
            if (filter.CreatedByMe.HasValue && filter.CreatedByMe.Value)
            {
                query = query.Where(p => p.CreatedById.Equals(user.GetUserId()));
            }

            if (filter.FiscalYear.HasValue)
            {
                query = query.Where(p => p.ActualFiscalYear == filter.FiscalYear);
            }

            if (filter.Active.HasValue && filter.Active.Value)
            {
                query = query.Where(p => !p.Status.IsTerminal);
            }

            if (filter.StatusId?.Any() == true)
            {
                query = query.Where(p => filter.StatusId.Contains(p.StatusId));
            }

            if (filter.Agencies?.Any() == true)
            {
                // Get list of sub-agencies for any agency selected in the filter.
                var agencies = filter.Agencies.Concat(context.Agencies.AsNoTracking().Where(a => filter.Agencies.Contains(a.Id)).SelectMany(a => a.Children.Select(ac => ac.Id)).ToArray()).Distinct();
                query = query.Where(p => agencies.Contains(p.AgencyId));
            }

            if (filter.Workflows?.Any() == true)
            {
                query = query.Where(p => p.Status.Workflows.Any(w => filter.Workflows.Contains(w.Workflow.Code)));
            }

            if (filter.ReportId.HasValue)
            {
                query = query.Include(p => p.Snapshots);
            }
            // Only admins can view all agency projects.
            if (!isAdmin)
            {
                query = query.Where(p => userAgencies.Contains(p.AgencyId));
            }

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderByDescending(p => p.ActualFiscalYear).OrderByDescending(p => p.ReportedFiscalYear).OrderByDescending(p => p.ProjectNumber).OrderByDescending(p => p.CreatedOn);

            return query;
        }

        /// Generate a new project number in the database.
        /// NOTE - this saves current changes to the datasource and should be called before other changes.
        /// If the subsequent save to the database fails the project number will be unused and result in an orphan.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static Entity.ProjectNumber GenerateProjectNumber(this PimsContext context)
        {
            var projectNumber = new Entity.ProjectNumber();
            context.ProjectNumbers.Add(projectNumber);
            context.SaveChanges();
            return projectNumber;
        }

        /// <summary>
        /// Generate a new project number in the database.
        /// NOTE - this saves current changes to the datasource and should be called before other changes.
        /// If the subsequent save to the database fails the project number will be unused and result in an orphan.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string GenerateProjectNumber(this PimsContext context, string format)
        {
            var projectNumber = context.GenerateProjectNumber();
            return projectNumber.Generate(format);
        }

        /// <summary>
        /// Generate a formatted project number for a project for the specified `projectNumber`.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static string Generate(this Entity.ProjectNumber projectNumber, string format)
        {
            return String.Format(format, projectNumber.Id);
        }

        /// <summary>
        /// Add a parcel(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Property[] properties)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var p in properties)
            {
                var pp = new Entity.ProjectProperty(project, p);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Add a parcel(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="parcels"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Parcel[] parcels)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var p in parcels)
            {
                var pp = new Entity.ProjectProperty(project, p);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Add a building(s) to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="buildings"></param>
        /// <returns></returns>
        public static IEnumerable<Entity.ProjectProperty> AddProperty(this Entity.Project project, params Entity.Building[] buildings)
        {
            var result = new List<Entity.ProjectProperty>();
            foreach (var b in buildings)
            {
                var pp = new Entity.ProjectProperty(project, b);
                project.Properties.Add(pp);
                result.Add(pp);
            }
            return result;
        }

        /// <summary>
        /// Update the originalProperty.agencyId and originalProperty.classificationId using the specified property.
        /// </summary>
        /// <param name="originalProperty"></param>
        /// <param name="property"></param>
        /// <returns></returns>
        public static Entity.Property UpdateProjectProperty(this Entity.ProjectProperty originalProperty, Entity.ProjectProperty property)
        {
            switch (property.PropertyType)
            {
                case (Entity.PropertyTypes.Land):
                    if (originalProperty.Parcel == null || property.Parcel == null) throw new InvalidOperationException("Unable to transfer parcel.");
                    originalProperty.Parcel.AgencyId = property.Parcel.AgencyId;
                    originalProperty.Parcel.ClassificationId = property.Parcel.ClassificationId;
                    originalProperty.Parcel.ProjectNumbers = "[]";
                    originalProperty.Parcel.PropertyTypeId = (int)PropertyTypes.Land; // when an agency transition occurs, and subdivisions should transition into parcels.
                    return originalProperty.Parcel;
                case (Entity.PropertyTypes.Building):
                    if (originalProperty.Building == null || property.Building == null) throw new InvalidOperationException("Unable to transfer building.");
                    originalProperty.Building.AgencyId = property.Building.AgencyId;
                    originalProperty.Building.ClassificationId = property.Building.ClassificationId;
                    originalProperty.Building.ProjectNumbers = "[]";
                    return originalProperty.Building;
            }

            return null;
        }

        /// <summary>
        /// Add a tasks to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="tasks"></param>
        /// <returns></returns>
        public static Entity.Project AddTask(this Entity.Project project, params Entity.Task[] tasks)
        {
            tasks.ForEach(t =>
            {
                project.Tasks.Add(new Entity.ProjectTask(project, t));
            });
            return project;
        }

        /// <summary>
        /// Determine the financial year the project is based on.
        /// Scans properties and gets the most recent evaluation date.
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public static DateTime GetProjectFinancialDate(this Entity.Project project) // TODO: This is most likely invalid, but for now will work.
        {
            return project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Land).Select(p => p.Parcel).SelectMany(p => p.Evaluations).Max(p => (DateTime?)p.Date)
                ?? project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Building).Select(p => p.Building).SelectMany(p => p.Evaluations).Max(b => (DateTime?)b.Date)
                ?? project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Land).Select(p => p.Parcel).SelectMany(p => p.Fiscals).Max(b => (DateTime?)new DateTime(b.FiscalYear, 1, 1))
                ?? project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Building).Select(p => p.Building).SelectMany(p => p.Fiscals).Max(b => (DateTime?)new DateTime(b.FiscalYear, 1, 1))
                ?? DateTime.UtcNow;
        }

        /// <summary>
        /// Release properties from project, such as during the deny or cancelled statuses
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static void ReleaseProjectProperties(this PimsContext context, Entity.Project project)
        {
            project.Properties.ForEach(p =>
            {
                context.Update(p.RemoveProjectNumber(project.ProjectNumber));
            });
        }

        /// <summary>
        /// Dispose properties from project, during the disposed workflow status.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static void DisposeProjectProperties(this PimsContext context, Entity.Project project)
        {
            var disposed = context.PropertyClassifications.AsNoTracking().FirstOrDefault(c => c.Name == "Disposed") ?? throw new KeyNotFoundException("Classification 'Disposed' not found.");
            var parentParcels = GetSubdivisionParentParcels(project);
            DisposeSubdivisionParentParcels(context, parentParcels);
            project.Properties.Where(p => !parentParcels.Any(pp => pp.Id == p.Id)).ForEach(p =>
            {
                switch (p.PropertyType)
                {
                    case (Entity.PropertyTypes.Land):
                        if (p.Parcel == null) throw new InvalidOperationException("Unable to update parcel status.");
                        p.Parcel.ClassificationId = disposed.Id;
                        p.Parcel.AgencyId = null;
                        p.Parcel.PropertyTypeId = (int)PropertyTypes.Land; // all subdivisions should be transitioned to parcels after they are disposed.
                        p.Parcel.Parcels.Clear(); // remove all references to parent parcels.
                        break;
                    case (Entity.PropertyTypes.Building):
                        if (p.Building == null) throw new InvalidOperationException("Unable to update building status.");
                        p.Building.ClassificationId = disposed.Id;
                        p.Building.AgencyId = null;
                        break;
                }
                context.Update(p);
            });

        }

        /// <summary>
        /// Disposes parent parcels of subdivisions by setting the classification to subdivided
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parentParcels"></param>
        public static void DisposeSubdivisionParentParcels(this PimsContext context, IEnumerable<Parcel> parentParcels)
        {
            var subdivided = context.PropertyClassifications.AsNoTracking().FirstOrDefault(c => c.Name == "Subdivided") ?? throw new KeyNotFoundException("Classification 'Subdivided' not found.");
            parentParcels.ForEach(parentParcel =>
            {
                parentParcel.ClassificationId = subdivided.Id;
                context.Update(parentParcel);
            });
        }

        /// <summary>
        /// Returns all parcels in project that contain at least one subdivision parcel (with an array of parent parcels).
        /// </summary>
        /// <param name="originalProject"></param>
        public static IEnumerable<Entities.Parcel> GetSubdivisionParentParcels(this Entity.Project originalProject)
        {
            var projectParcels = originalProject.Properties.Select(p => p.Parcel).Where(p => p != null);
            return projectParcels.SelectMany(pp => pp.Parcels).Where(p => p?.Parcel != null).Select(p => p.Parcel);
        }

        /// <summary>
        /// Transfer Project properties to a new agency with updated classifications
        /// </summary>
        /// <param name="context"></param>
        /// <param name="originalProject"></param>
        /// <param name="project"></param>
        /// <returns></returns>
        public static void TransferProjectProperties(this PimsContext context, Entity.Project originalProject, Entity.Project project)
        {
            var parentParcels = originalProject.GetSubdivisionParentParcels();
            context.DisposeSubdivisionParentParcels(parentParcels);
            var propertiesWithNoSubdivisions = originalProject.Properties.Where(p => !parentParcels.Any(pp => p.Parcel?.Id == pp.Id));
            propertiesWithNoSubdivisions.ForEach(p =>
            {
                var matchingProperty = project.Properties.First(property => p.Id == property.Id);
                context.Update(p.UpdateProjectProperty(matchingProperty));
            });
        }

        /// <summary>
        /// Determine if the project is editable to the specified 'user'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static bool IsProjectEditable(this Entity.Project project, ClaimsPrincipal user, ProjectOptions options)
        {
            return user.HasPermission(Permissions.AdminProjects) || (user.HasPermission(Permissions.ProjectEdit) && project.IsProjectInDraft(options));
        }

        /// <summary>
        /// Determine if the project is in draft.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static bool IsProjectInDraft(this Entity.Project project, ProjectOptions options)
        {
            if (project.Workflow == null) throw new ArgumentNullException(nameof(project), "The 'Workflow' cannot be null.");
            return options.DraftWorkflows.Contains(project.Workflow.Code);
        }

        /// <summary>
        /// Determine if the project is closed or complete.
        /// </summary>
        /// <param name="project"></param>
        /// <returns></returns>
        public static bool IsProjectClosed(this Entity.Project project)
        {
            if (project.Status == null) throw new ArgumentNullException(nameof(project.Status));

            return project.Status.IsTerminal;
        }

        /// <summary>
        /// Merge the specified 'updatedProject' changes into the specified 'originalProject'.
        /// </summary>
        /// <param name="originalProject"></param>
        /// <param name="updatedProject"></param>
        /// <param name="context"></param>
        public static void Merge(this Entity.Project originalProject, Entity.Project updatedProject, PimsContext context)
        {
            // Update a project
            var agency = originalProject.Agency;
            var originalMetadata = context.Deserialize<DisposalProjectMetadata>(originalProject.Metadata ?? "{}"); // TODO: Need to test whether automatically overwriting the metadata is correct.

            var createdById = originalProject.CreatedById;
            var updatedById = originalProject.UpdatedById;
            context.Entry(originalProject).CurrentValues.SetValues(updatedProject);
            originalProject.Agency = agency; // Don't want to allow agency to change through this method.
            originalProject.CreatedById = updatedById; // Don't want these updated externally.
            originalProject.UpdatedById = updatedById; // Don't want these updated externally.
            context.SetOriginalRowVersion(originalProject);

            var agencies = originalProject.Agency.ParentId.HasValue ? new[] { originalProject.AgencyId } : context.Agencies.Where(a => a.ParentId == originalProject.AgencyId || a.Id == originalProject.AgencyId).Select(a => a.Id).ToArray();

            // Update all properties
            foreach (var property in updatedProject.Properties)
            {
                var existingProperty = originalProject.Properties
                    .FirstOrDefault(b => b.PropertyType == Entity.PropertyTypes.Land
                    && b.ParcelId == property.ParcelId
                    && b.ProjectId == updatedProject.Id
                    ||
                    b.PropertyType == Entity.PropertyTypes.Building
                    && b.ProjectId == updatedProject.Id
                    && b.BuildingId == property.BuildingId);

                if (existingProperty == null)
                {
                    //Todo: Navigation properties on project object were causing concurrency exceptions.
                    var eproperty = property.PropertyType == Entity.PropertyTypes.Land ? context.Parcels.Find(property.ParcelId) : context.Buildings.Find(property.BuildingId) as Entity.Property;
                    // Ignore properties that don't exist.
                    if (eproperty != null)
                    {
                        if (property.PropertyType == Entity.PropertyTypes.Land)
                        {
                            var existingParcel = context.Parcels
                                .Include(p => p.Agency)
                                .Include(p => p.Evaluations)
                                .Include(p => p.Fiscals)
                                .FirstOrDefault(p => p.Id == property.ParcelId);
                            existingParcel.ThrowIfPropertyNotInProjectAgency(agencies);
                            existingParcel.UpdateProjectNumbers(updatedProject.ProjectNumber);
                        }
                        else
                        {
                            var existingBuilding = context.Buildings
                                .Include(b => b.Agency)
                                .Include(p => p.Evaluations)
                                .Include(p => p.Fiscals)
                                .FirstOrDefault(p => p.Id == property.BuildingId);
                            existingBuilding.ThrowIfPropertyNotInProjectAgency(agencies);
                            existingBuilding.UpdateProjectNumbers(updatedProject.ProjectNumber);
                        }
                        originalProject.AddProperty(eproperty);
                    }
                }
                else
                {
                    if (property.PropertyType == Entity.PropertyTypes.Land)
                    {
                        // Only allow editing the classification and evaluations/fiscals for now
                        existingProperty.UpdateProjectNumbers(updatedProject.ProjectNumber);
                        if (property.Parcel != null)
                        {
                            context.Entry(existingProperty.Parcel).Collection(p => p.Evaluations).Load();
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
                                    context.Entry(existingEvaluation).CurrentValues.SetValues(evaluation);
                                }
                            }

                            existingProperty.Parcel.RemoveEvaluationsWithinOneYear(property.Parcel, originalMetadata.DisposedOn);

                            context.Entry(existingProperty.Parcel).Collection(p => p.Fiscals).Load();
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
                                    context.Entry(existingFiscal).CurrentValues.SetValues(fiscal);
                                }
                            }
                        }
                    }
                    else if (property.PropertyType == Entity.PropertyTypes.Building)
                    {
                        // Only allow editing the classification and evaluations/fiscals for now
                        context.Entry(existingProperty.Building).Collection(p => p.Evaluations).Load();
                        existingProperty.UpdateProjectNumbers(updatedProject.ProjectNumber);
                        if (property.Building != null)
                        {
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
                                    context.Entry(existingEvaluation).CurrentValues.SetValues(evaluation);
                                }
                            }
                            existingProperty.Building.RemoveEvaluationsWithinOneYear(property.Building, originalMetadata.DisposedOn);

                            context.Entry(existingProperty.Building).Collection(p => p.Fiscals).Load();
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
                                    context.Entry(existingFiscal).CurrentValues.SetValues(fiscal);
                                }
                            }
                        }
                    }
                }
            }

            // Remove any properties from this project that are no longer associated.
            var removePropertyIds = originalProject.Properties.Where(p => p.Id != 0).Select(p => p.Id).Except(updatedProject.Properties.Where(p => p.Id != 0).Select(p => p.Id));
            var removeProperties = originalProject.Properties.Where(p => removePropertyIds.Contains(p.Id));

            var removeParcelIds = removeProperties.Where(p => p.ParcelId.HasValue).Select(p => p.ParcelId.Value).ToArray();
            var removeParcels = context.Parcels.Where(p => removeParcelIds.Contains(p.Id));
            removeParcels.ForEach(p =>
            {
                p.RemoveProjectNumber(updatedProject.ProjectNumber);
                context.Parcels.Update(p);
            });

            var removeBuildingIds = removeProperties.Where(b => b.BuildingId.HasValue).Select(p => p.BuildingId.Value).ToArray();
            var removeBuildings = context.Buildings.Where(p => removeBuildingIds.Contains(p.Id));
            removeBuildings.ForEach(b =>
            {
                b.RemoveProjectNumber(updatedProject.ProjectNumber);
                context.Buildings.Update(b);
            });

            originalProject.Properties.RemoveAll(p => removePropertyIds.Contains(p.Id));

            // Update tasks
            foreach (var task in updatedProject.Tasks)
            {
                var originalProjectTask = originalProject.Tasks.FirstOrDefault(t => t.TaskId == task.TaskId);

                if (originalProjectTask == null)
                {
                    originalProject.Tasks.Add(task);
                }
                else
                {
                    context.Entry(originalProjectTask).CurrentValues.SetValues(task);
                }
            }

            // Update responses
            foreach (var response in updatedProject.Responses)
            {
                var originalProjectResponse = originalProject.Responses.FirstOrDefault(r => r.AgencyId == response.AgencyId);

                if (originalProjectResponse == null)
                {
                    originalProject.Responses.Add(response);
                }
                else
                {
                    context.Entry(originalProjectResponse).CurrentValues.SetValues(response);
                }
            }

            // Update notes
            foreach (var note in updatedProject.Notes)
            {
                var originalNote = originalProject.Notes.FirstOrDefault(r => r.Id == note.Id && note.Id > 0);

                if (originalNote == null)
                {
                    originalProject.Notes.Add(note);
                }
                else
                {
                    context.Entry(originalNote).CurrentValues.SetValues(note);
                }
            }

            var toStatus = context.ProjectStatus
                .Include(s => s.Tasks)
                .FirstOrDefault(s => s.Id == updatedProject.StatusId);
            updatedProject.Status = toStatus;

            // If the tasks haven't been specified, generate them.
            var taskIds = updatedProject.Tasks.Select(t => t.TaskId).ToArray();
            // Add the tasks for project status if they are not already added.
            foreach (var task in toStatus.Tasks.Where(t => !taskIds.Contains(t.Id)))
            {
                originalProject.Tasks.Add(new Entity.ProjectTask(updatedProject, task));
            }
        }

        /// <summary>
        /// Set Project properties' visibility to other agencies
        /// </summary>
        /// <param name="context"></param>
        /// <param name="project"></param>
        /// <param name="visibility"></param>
        public static void SetProjectPropertiesVisiblity(this PimsContext context, Entity.Project project, bool visibility)
        {
            project.Properties.ForEach(p =>
            {
                if (p.BuildingId.HasValue)
                {
                    p.Building.IsVisibleToOtherAgencies = visibility;
                    context.Buildings.Update(p.Building);
                }
                else if (p.ParcelId.HasValue)
                {
                    p.Parcel.IsVisibleToOtherAgencies = visibility;
                    context.Parcels.Update(p.Parcel);
                }
            });
        }

        /// <summary>
        /// Add responses to the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="responses"></param>
        /// <returns></returns>
        public static Entity.Project AddResponses(this Entity.Project project, params Entity.ProjectAgencyResponse[] responses)
        {
            responses.ForEach(r =>
            {
                project.Responses.Add(r);
            });
            return project;
        }

        /// Get a collection of responses that have changed from the original to the updated project.
        /// </summary>
        /// <param name="originalProject"></param>
        /// <param name="updatedProject"></param>
        /// <returns></returns>
        public static IEnumerable<ProjectAgencyResponse> GetResponseChanges(this Entity.Project originalProject, Entity.Project updatedProject)
        {
            if (updatedProject == null) throw new ArgumentNullException(nameof(updatedProject));

            var responses = new List<ProjectAgencyResponse>(updatedProject.Responses.Count());
            foreach (var response in updatedProject.Responses)
            {
                var originalResponse = originalProject.Responses.FirstOrDefault(r => r.ProjectId == response.ProjectId && r.AgencyId == response.AgencyId);
                if (originalResponse == null || originalResponse.Response != response.Response)
                {
                    responses.Add(response);
                }
            }

            // Any responses that were deleted should now be ignored.
            foreach (var response in originalProject.Responses.Except(responses))
            {
                response.Response = NotificationResponses.Ignore;
                responses.Add(response);
            }
            return responses;
        }

        /// <summary>
        /// Removes any responses from the original project that have been removed from the updated project.
        /// </summary>
        /// <param name="originalProject"></param>
        /// <param name="updatedProject"></param>
        public static void UpdateResponses(this Entity.Project originalProject, Entity.Project updatedProject)
        {
            var responseIds = updatedProject.Responses.Select(r => r.AgencyId).ToArray();
            var removeResponses = originalProject.Responses.Where(r => !responseIds.Contains(r.AgencyId)).ToArray();
            foreach (var response in removeResponses)
            {
                originalProject.Responses.Remove(response);
            }
        }
    }
}
