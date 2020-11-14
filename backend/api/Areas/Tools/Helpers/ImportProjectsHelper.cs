using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Helpers
{
    /// <summary>
    /// ImportProjectsHelper class, provides a helper to import projects into PIMS.
    /// </summary>
    public class ImportProjectsHelper
    {
        #region Variables
        private readonly IPimsService _service;
        private readonly IPimsAdminService _adminService;
        private readonly ILogger _logger;
        private readonly IList<Entity.Workflow> _workflows;
        private readonly IList<Entity.ProjectStatus> _status;
        private readonly IList<Entity.ProjectRisk> _risks;
        private readonly IList<Entity.Agency> _agencies;
        private readonly IList<Entity.TierLevel> _tiers;
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportProjectsHelper, initializes with specified arguments.
        /// </summary>
        /// <param name="service"></param>
        /// <param name="adminService"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="logger"></param>
        public ImportProjectsHelper(IPimsService service, IPimsAdminService adminService, IOptions<JsonSerializerOptions> serializerOptions, ILogger logger)
        {
            _service = service;
            _adminService = adminService;
            _serializerOptions = serializerOptions.Value;
            _logger = logger;
            
            _workflows = adminService.Workflow.GetAll().ToArray();
            _status = adminService.ProjectStatus.GetAll().ToArray();
            _risks = adminService.ProjectRisk.GetAll().ToArray();
            _agencies = adminService.Agency.GetAll().ToArray();
            _tiers = adminService.TierLevel.GetAll().ToArray();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Add or update projects within PIMS.
        /// </summary>
        /// <param name="models"></param>
        /// <param name="stopOnError"></param>
        /// <param name="defaults"></param>
        /// <returns></returns>
        public IEnumerable<Entity.Project> AddUpdateProjects(IEnumerable<Model.ImportProjectModel> models, bool stopOnError = true, string[] defaults = null)
        {
            var projects = models.Select(p => Merge(_adminService.Project.Get(p.ProjectNumber), p, stopOnError, defaults)).ToArray().NotNull();

            var addProjects = projects.Where(p => p.Id == 0);
            var updateProjects = projects.Where(p => p.Id != 0);

            if (addProjects.Any())
            {
                _adminService.Project.Add(addProjects);

                UpdateProjectNumbers(addProjects);
            }

            if (updateProjects.Any())
            {
                _adminService.Project.Update(updateProjects);

                UpdateProjectNumbers(updateProjects);
            }

            return projects;
        }
        #endregion

        #region Helpers
        /// <summary>
        /// If a project has a temporary number and it is not in the draft workflow it should have a proper number.
        /// </summary>
        /// <param name="projects"></param>
        private void UpdateProjectNumbers(IEnumerable<Entity.Project> projects)
        {
            // If any project received a temporary number it may need to be updated.
            foreach (var project in projects.Where(p => p.ProjectNumber.StartsWith("TEMP")))
            {
                var workflow = _adminService.Workflow.Get(project.WorkflowId.Value);
                if (workflow.Code != "SUBMIT-DISPOSAL")
                {
                    var projectNumber = _adminService.Project.GenerateProjectNumber();
                    _adminService.Project.UpdateProjectNumber(project, projectNumber);
                }
            }
        }

        /// <summary>
        /// Copy the 'model' project properties into existing projects, or add new projects to PIMS.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="model"></param>
        /// <param name="stopOnError"></param>
        /// <param name="defaults"></param>
        /// <returns></returns>
        private Entity.Project Merge(Entity.Project project, Model.ImportProjectModel model, bool stopOnError = true, string[] defaults = null)
        {
            try
            {
                // Use defaults if required
                if (defaults?.Any() ?? false)
                {
                    var props = typeof(Model.ImportProjectModel).GetCachedProperties();
                    foreach (var kv in defaults)
                    {
                        var keyValue = kv.Trim().Split("=");

                        if (keyValue.Length < 2) throw new ArgumentException($"Argument '{kv}' is not valid.");

                        var prop = props.FirstOrDefault(p => String.Compare(p.Name, keyValue[0], true) == 0);
                        var modelValue = prop?.GetValue(model);
                        if (prop != null && modelValue == null || modelValue.Equals(prop.PropertyType.GetDefault()))
                        {
                            var value = Convert.ChangeType(keyValue[1], prop.PropertyType);
                            prop.SetValue(model, value);
                        }
                    }
                }

                _logger.LogDebug($"Importing Project '{model.ProjectNumber}', agency:'{model.Agency}', workflow:'{model.Workflow}', status:'{model.Status}'");

                var status = GetStatus(model.Status);

                // Default to the last workflow this status is associated with.
                // This isn't ideal and could end up with projects assocaited with an incorrect workflow, however
                var workflow = !String.IsNullOrWhiteSpace(model.Workflow) ? GetWorkflow(model.Workflow) : model.Activity switch
                {
                    "Completed Deal" => GetWorkflow("SPL"),
                    "Contract in Place" => GetWorkflow("SPL"),
                    "On Market" => GetWorkflow("SPL"),
                    "Pre-Market" => GetWorkflow("SPL"),
                    _ => _adminService.Workflow.GetForStatus(model.Status).OrderBy(w => w.SortOrder).Last()
                };

                project ??= new Entity.Project();

                project.ProjectNumber = model.ProjectNumber == "SPP-000" ? $"TEMP-{DateTime.UtcNow.Ticks:00000}" : model.ProjectNumber; // These will get newly generated numbers.
                project.Name = model.Description.Truncate(100);
                project.Description = model.Description;
                project.Manager = model.Manager;
                project.ActualFiscalYear = model.ActualFiscalYear;
                project.ReportedFiscalYear = model.ReportedFiscalYear;

                project.Agency = GetAgency(model.Agency);
                project.AgencyId = project.Agency.Id;
                project.Workflow = workflow;
                project.WorkflowId = workflow.Id;
                project.Status = status;
                project.StatusId = status.Id;

                // Extract properties from PID note.
                var pids = model.Notes.FirstOrDefault(n => n.Key == "PID").Value;
                if (!String.IsNullOrWhiteSpace(pids))
                {
                    var matches = Regex.Matches(pids, "[0-9]{3}-[0-9]{3}-[0-9]{3}");

                    // Need to load any properties currently linked to this project.
                    if (project.Id > 0)
                    {
                        var existingProject = _service.Project.Get(project.ProjectNumber);

                        matches.ForEach(m =>
                        {
                            // If the parcel has not already been added, add it to the project.
                            if (!existingProject.Properties.Any(p => p.PropertyType == Entity.PropertyTypes.Land && p.Parcel.ParcelIdentity == m.Value))
                                matches.ForEach(m => AddProperty(project, m.Value));
                        });

                    }
                    else
                    {
                        matches.ForEach(m => AddProperty(project, m.Value));
                    }
                }

                project.TierLevel = GetTier(model.Market, project.Properties.Count()); // TODO: Need to import or link project properties.
                project.TierLevelId = project.TierLevel.Id;
                project.Risk = GetRisk(model.Risk);
                project.RiskId = project.Risk.Id;

                project.Assessed = model.Assessed ?? project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Land).Sum(p => p.Parcel.Evaluations.Where(e => e.Key == Entity.EvaluationKeys.Assessed).OrderByDescending(e => e.Date).First().Value);
                project.NetBook = model.NetBook;
                project.Market = model.Market;
                project.Appraised = model.Appraised;

                project.SubmittedOn = new DateTime(model.ReportedFiscalYear - 1, 1, 1); // Don't have a source for this information.
                project.ApprovedOn = project.SubmittedOn; // Don't have a source for this information.
                project.CompletedOn = model.CompletedOn;

                var metadata = new Entity.Models.DisposalProjectSnapshotMetadata
                {
                    InitialNotificationSentOn = null, // Don't have a source for this information.
                    ThirtyDayNotificationSentOn = null, // Don't have a source for this information.
                    SixtyDayNotificationSentOn = null, // Don't have a source for this information.
                    NinetyDayNotificationSentOn = null, // Don't have a source for this information.
                    OnHoldNotificationSentOn = null, // Don't have a source for this information.
                    InterestedReceivedOn = null, // Don't have a source for this information.
                    TransferredWithinGreOn = null, // Don't have a source for this information.
                    ClearanceNotificationSentOn = null, // Don't have a source for this information.
                    RequestForSplReceivedOn = model.RequestForSplReceivedOn, // Don't have a source for this information.
                    ApprovedForSplOn = model.ApprovedForSplOn,
                    MarketedOn = model.MarketedOn,
                    Purchaser = model.Purchaser,
                    OcgFinancialStatement = model.OcgFinancialStatement,
                    AppraisedBy = model.AppraisedBy,
                    ProgramCost = model.ProgramCost,
                    SalesCost = model.SalesCost,
                    InterestComponent = model.InterestComponent,
                    NetProceeds = model.NetProceeds,
                    GainLoss = model.GainLoss,
                    SaleWithLeaseInPlace = model.SaleWithLeaseInPlace,
                    DisposedOn = model.DisposedOn ?? (project.Status.Code == "DIS" ? model.CompletedOn : null),
                    IsContractConditional = model.IsContractConditional.HasValue ? model.IsContractConditional : false, // Don't have a source for this information.
                    OfferAmount = project.Status.Code == "DIS" ? model.Market : (decimal?)null, // This value would only be accurate if the property is disposed.
                    OfferAcceptedOn = model.CompletedOn // Don't have a source for this information.
                };

                // A prior net proceeds was provided, which means a prior snapshot needs to be generated.
                if (model.PriorNetProceeds.HasValue) // TODO: Need to test this.
                {
                    metadata.BaselineIntegrity = model.PriorNetProceeds.Value - metadata.NetProceeds;
                    var snapshot = new Entity.ProjectSnapshot(project)
                    {
                        Metadata = JsonSerializer.Serialize(metadata, _serializerOptions)
                    };
                    project.Snapshots.Add(snapshot);
                }

                project.Metadata = JsonSerializer.Serialize(metadata, _serializerOptions);

                // The data doesn't provide the purchasing agency information so the response will be the current owning agency.
                if (model.AgencyResponseDate.HasValue)
                {
                    var response = project.Responses.FirstOrDefault(r => r.AgencyId == project.AgencyId);
                    if (response == null)
                    {
                        project.Responses.Add(new Entity.ProjectAgencyResponse(project, project.Agency, Entity.NotificationResponses.Watch, model.AgencyResponseDate));
                    }
                    else
                    {
                        response.Response = Entity.NotificationResponses.Watch;
                        response.ReceivedOn = model.AgencyResponseDate ?? response.ReceivedOn;
                    }
                }

                foreach (var note in model.Notes)
                {
                    AddNote(project, note.Key, note.Value);
                }

                // Add tasks if they haven't been added already.
                if (!project.Tasks.Any())
                {
                    // Assumption we'll need to add all tasks from Submit to SPL.
                    var tasks = _service.Task.GetForWorkflow("SUBMIT-DISPOSAL");
                    tasks = tasks.Concat(_service.Task.GetForWorkflow("ASSESS-DISPOSAL"));
                    tasks = tasks.Concat(_service.Task.GetForWorkflow("ERP"));
                    tasks = tasks.Concat(_service.Task.GetForWorkflow("SPL"));
                    project.AddTask(tasks.DistinctBy(t => t.Id).ToArray());
                    project.Tasks.ForEach(t =>
                    {
                        t.IsCompleted = !t.Task.IsOptional; // Complete all required steps.
                        t.Task = null;
                    });
                }

                _logger.LogDebug($"Parsed project '{project.ProjectNumber}' - '{project.Status.Code}'", project);

                return project;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to parse this project while importing '{model.ProjectNumber}' - {ex.Message}");
                if (stopOnError) throw;
                return null;
            }
        }

        /// <summary>
        /// Append a new note to the project.
        /// Parse the 'noteType' value, or set it as 'General'.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="noteType"></param>
        /// <param name="note"></param>
        private void AddNote(Entity.Project project, string noteType, string note)
        {
            if (!String.IsNullOrWhiteSpace(note))
            {
                if (!Enum.TryParse(noteType, true, out Entity.NoteTypes type))
                {
                    type = noteType switch
                    {
                        "Property" => Entity.NoteTypes.Public,
                        "PID" => Entity.NoteTypes.Public,
                        "LandLegalDescription" => Entity.NoteTypes.Public,
                        "Surplus Dec / Readiness Checklist" => Entity.NoteTypes.Public,
                        "TBL - CBA" => Entity.NoteTypes.Public,
                        "Enhanced Referral Comments" => Entity.NoteTypes.Private,
                        "Interest from Enhanced Referral" => Entity.NoteTypes.AgencyInterest,
                        "Business Case Comments" => Entity.NoteTypes.Private,
                        "Business Case Submitted" => Entity.NoteTypes.Private,
                        "Clearance Letter Issued" => Entity.NoteTypes.Private,
                        "Appraisal Date" => Entity.NoteTypes.Appraisal,
                        "Assessed & Appraised Comments" => Entity.NoteTypes.Appraisal,
                        "Weekly Review" => Entity.NoteTypes.Private,
                        _ => Entity.NoteTypes.General
                    };
                    note = $"{noteType}{Environment.NewLine}{note}";
                }

                var financialNote = project.Notes.FirstOrDefault(n => n.NoteType == type);
                if (financialNote == null)
                {
                    project.Notes.Add(new Entity.ProjectNote(project, type, note));
                }
                else
                {
                    if (!String.IsNullOrWhiteSpace(financialNote.Note))
                        financialNote.Note += $"{Environment.NewLine}{Environment.NewLine}{note}";
                    else
                        financialNote.Note = note;
                }
            }
        }

        /// <summary>
        /// Find the property for the specified 'pid' in inventory and add it to the project.
        /// Assumption is made that if the parcel is added, then also add all the buildings on the parcel.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        private Entity.Project AddProperty(Entity.Project project, string pid)
        {
            try
            {
                var pidValue = Int32.Parse(pid.Replace("-", ""));
                var parcel = _adminService.Parcel.GetByPid(pidValue);
                project.AddProperty(parcel).ForEach(p => {
                    p.Project = null;
                    p.Parcel = null; // Need to do this so that it isn't reattached.
                    project.Properties.Add(p);
                });
                var buildings = parcel.Buildings.Select(b => b.Building).ToArray();
                project.AddProperty(buildings).ForEach(b =>
                {
                    b.Project = null;
                    b.Building = null; // Need to do this so that it isn't reattached.
                    project.Properties.Add(b);
                });
                _logger.LogInformation($"Property '{pid}' added to project '{project.ProjectNumber}'.");
            }
            catch (KeyNotFoundException)
            {
                _logger.LogWarning($"Property '{pid}' not found on project '{project.ProjectNumber}'.");
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, $"Property '{pid}' not found on project '{project.ProjectNumber}'.");
            }
            return project;
        }

        /// <summary>
        /// Get the project risk based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.ProjectRisk GetRisk(string value)
        {
            return _adminService.ProjectRisk.Get(_risks.FirstOrDefault(r => r.Name.ToLower() == value.ToLower())?.Id ?? throw new KeyNotFoundException($"Risk '{value}' does not exist."));
        }

        /// <summary>
        /// Get the workflow based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.Workflow GetWorkflow(string value)
        {
            return _adminService.Workflow.Get(_workflows.FirstOrDefault(w => w.Code == value)?.Id ?? throw new KeyNotFoundException($"Workflow '{value}' does not exist."));
        }

        /// <summary>
        /// Get the project status based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.ProjectStatus GetStatus(string value)
        {
            return _adminService.ProjectStatus.Get(_status.FirstOrDefault(a => a.Code == value)?.Id ?? throw new KeyNotFoundException($"Project status '{value}' does not exist."));
        }

        /// <summary>
        /// Get the tier level based on the value and the number of properties.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        private Entity.TierLevel GetTier(decimal value, int properties)
        {
            Entity.TierLevel tier;
            if (value >= 10000000m && properties > 1) tier = _tiers.FirstOrDefault(t => t.Id == 4);
            else if (value >= 10000000m) tier = _tiers.FirstOrDefault(t => t.Id == 3);
            else if (value >= 1000000m) tier = _tiers.FirstOrDefault(t => t.Id == 2);
            tier = _tiers.FirstOrDefault(t => t.Id == 1);

            return _adminService.TierLevel.Get(tier.Id);
        }

        /// <summary>
        /// Get the agency for the specified code 'value'.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.Agency GetAgency(string value)
        {
            return _adminService.Agency.Get(_agencies.FirstOrDefault(a => a.Name == value || a.Code == value)?.Id ?? throw new KeyNotFoundException($"Agency '{value}' does not exist."));
        }
        #endregion
    }
}

