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

        /// <summary>
        /// An array of project status for marketed and beyond.
        /// </summary>
        /// <value></value>
        private static readonly string[] marketed = new[] { "SPL-M", "SPL-CIP-U", "SPL-CIP-C", "DIS" };
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
        /// <param name="fromSnapshot"></param>
        /// <param name="defaults"></param>
        /// <returns></returns>
        public IEnumerable<Entity.Project> AddUpdateProjects(IEnumerable<Model.ImportProjectModel> models, bool stopOnError = true, DateTime? fromSnapshot = null, string[] defaults = null)
        {
            var projects = new List<Entity.Project>();
            foreach (var model in models)
            {
                try
                {
                    ApplyDefaults(model, fromSnapshot, defaults);

                    _logger.LogDebug($"Importing Project '{model.ProjectNumber}', agency:'{model.Agency}', workflow:'{model.Workflow}', status:'{model.Status}'");
                    var project = Merge(_adminService.Project.Get(model.ProjectNumber), model);
                    projects.Add(project);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to parse this project while importing '{model.ProjectNumber}' - {ex.GetAllMessages()}");
                    if (stopOnError) throw;
                }
            }

            _adminService.Project.Add(projects.Where(p => p.Id == 0));
            _adminService.Project.Update(projects.Where(p => p.Id != 0));
            UpdateProjectNumbers(projects);
            if (fromSnapshot.HasValue)
            {
                AddProjectReport(fromSnapshot.Value);
            }

            return projects;
        }
        #endregion

        #region Helpers
        /// <summary>
        /// Override the model values with the specified defaults.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="fromSnapshot"></param>
        /// <param name="defaults"></param>
        private void ApplyDefaults(Model.ImportProjectModel model, DateTime? fromSnapshot = null, string[] defaults = null)
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
                    if (prop != null && modelValue == null || modelValue?.Equals(prop.PropertyType.GetDefault()) == true)
                    {
                        if (prop.PropertyType == typeof(DateTime) || prop.PropertyType == typeof(DateTime?))
                        {
                            var value = DateTime.Parse(keyValue[1]);
                            prop.SetValue(model, value);
                        }
                        else
                        {
                            var value = Convert.ChangeType(keyValue[1], prop.PropertyType);
                            prop.SetValue(model, value);
                        }
                    }
                }
            }

            if (fromSnapshot.HasValue && !model.SnapshotOn.HasValue)
            {
                model.SnapshotOn = fromSnapshot;
            }
        }

        /// <summary>
        /// Copy the 'model' project properties into existing projects, or add new projects to PIMS.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        private Entity.Project Merge(Entity.Project project, Model.ImportProjectModel model)
        {
            var status = GetStatus(model.Status);

            // Default to the last workflow this status is associated with.
            // This isn't ideal and could end up with projects associated with an incorrect workflow.
            // Without better data from SIS it isn't entirely possible to determine the correct workflow automatically.
            var workflow = !String.IsNullOrWhiteSpace(model.Workflow) ? GetWorkflow(model.Workflow) : model.Activity switch
            {
                "Completed Deal" => GetWorkflow("SPL"),
                "Contract in Place" => GetWorkflow("SPL"),
                "On Market" => GetWorkflow("SPL"),
                "Pre-Market" => GetWorkflow("SPL"),
                "Not In Spl" => GetWorkflow("SPL"),
                _ => status.Code == "AP-!SPL"
                    ? _adminService.Workflow.Get(_workflows.FirstOrDefault(w => w.Code == "ERP").Id)
                    : _adminService.Workflow.GetForStatus(model.Status).OrderBy(w => w.SortOrder).Last()
            };

            project ??= new Entity.Project();

            project.ProjectNumber = String.IsNullOrWhiteSpace(model.ProjectNumber) ? $"TEMP-{DateTime.UtcNow.Ticks:00000}" : model.ProjectNumber;
            project.Name = model.Description.Truncate(100);
            project.Description = model.Description + (String.IsNullOrWhiteSpace(model.Location) ? null : Environment.NewLine + model.Location);
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
            var pidNote = model.Notes?.FirstOrDefault(n => n.Key == "PID").Value;
            var pids = Regex.Matches(pidNote ?? "", "[0-9]{3}-[0-9]{3}-[0-9]{3}").Select(m => m.Value).NotNull().Distinct();
            project.TierLevel = GetTier(model.Market, project.Properties.Any() ? project.Properties.Count() : pids.Count()); // Most projects have no properties linked.
            project.TierLevelId = project.TierLevel.Id;
            project.Risk = GetRisk(model.Risk);
            project.RiskId = project.Risk.Id;

            // If there are properties linked, load them into context.
            decimal assessed = 0;
            if (project.Properties.Any())
            {
                project.Properties.Where(p => p.PropertyType == Entity.PropertyTypes.Land).ForEach(p =>
                {
                    var property = _service.Parcel.Get(p.ParcelId.Value);
                    assessed += property.Evaluations.Where(e => e.Key == Entity.EvaluationKeys.Assessed).OrderByDescending(e => e.Date).FirstOrDefault()?.Value ?? 0;
                });
            }

            project.Assessed = model.Assessed ?? assessed;
            project.NetBook = model.NetBook;
            project.Market = model.Market;
            project.Appraised = model.Appraised;

            project.SubmittedOn = new DateTime(model.ReportedFiscalYear - 1, 1, 1); // Don't have a source for this information.
            project.ApprovedOn = project.SubmittedOn; // Don't have a source for this information.
            project.CompletedOn = model.CompletedOn;

            var metadata = new Entity.Models.DisposalProjectSnapshotMetadata
            {
                InitialNotificationSentOn = model.InitialNotificationSentOn,
                ThirtyDayNotificationSentOn = null, // Don't have a source for this information.
                SixtyDayNotificationSentOn = null, // Don't have a source for this information.
                NinetyDayNotificationSentOn = null, // Don't have a source for this information.
                OnHoldNotificationSentOn = null, // Don't have a source for this information.
                InterestedReceivedOn = model.InterestedReceivedOn,
                TransferredWithinGreOn = null, // Don't have a source for this information.
                ClearanceNotificationSentOn = model.ClearanceNotificationSentOn,
                RequestForSplReceivedOn = model.RequestForSplReceivedOn,
                ApprovedForSplOn = model.ApprovedForSplOn,
                MarketedOn = marketed.Contains(project.Status.Code) ? model.MarketedOn : null, // Only assign the marketed on date if the project is in an appropriate status.
                Purchaser = model.Purchaser,
                OcgFinancialStatement = model.OcgFinancialStatement,
                AppraisedBy = model.AppraisedBy,
                AppraisedOn = model.AppraisedOn,
                ProgramCost = model.ProgramCost,
                SalesCost = model.SalesCost,
                InterestComponent = model.InterestComponent,
                NetProceeds = model.NetProceeds,
                GainLoss = model.GainLoss,
                SaleWithLeaseInPlace = model.SaleWithLeaseInPlace,
                DisposedOn = model.DisposedOn ?? (project.Status.Code == "DIS" ? model.CompletedOn : null),
                OfferAmount = project.Status.Code == "DIS" ? model.Market : (decimal?)null, // This value would only be accurate if the property is disposed.
                OfferAcceptedOn = null, // Don't have a source for this information.
                ExemptionRequested = model.ExemptionRequested
            };

            // A prior net proceeds was provided, which means a prior snapshot needs to be generated.
            // If the project already exists, don't add prior snapshots.
            // Only create snapshots if a `snapshotOn` date has been provided.
            if (model.PriorNetProceeds.HasValue && project.Id == 0 && model.SnapshotOn.HasValue)
            {
                AddSnapshot(project, model, metadata);
            }

            project.Metadata = JsonSerializer.Serialize(metadata, _serializerOptions);

            // The data doesn't provide the purchasing agency information so the response will be the current owning agency.
            if (model.InterestedReceivedOn.HasValue)
            {
                var response = project.Responses.FirstOrDefault(r => r.AgencyId == project.AgencyId);
                if (response == null)
                {
                    project.Responses.Add(new Entity.ProjectAgencyResponse(project, project.Agency, Entity.NotificationResponses.Watch, model.InterestedReceivedOn));
                }
                else
                {
                    response.Response = Entity.NotificationResponses.Watch;
                    response.ReceivedOn = model.InterestedReceivedOn ?? response.ReceivedOn;
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
                var distinctTasks = tasks.DistinctBy(t => t.Id).ToArray();
                project.AddTask(distinctTasks);
                project.Tasks.ForEach(t =>
                {
                    t.IsCompleted = !t.Task.IsOptional; // Complete all required steps.
                    t.Task = null;
                });

                var erpTasks = _service.Task.GetForWorkflow("ERP");
                var splTasks = erpTasks.Concat(_service.Task.GetForWorkflow("SPL"));
                distinctTasks = splTasks.Where(t => !distinctTasks.Any(dt => dt.Id == t.Id)).DistinctBy(t => t.Id).ToArray();
                project.AddTask(distinctTasks);
                project.Tasks.ForEach(t =>
                {
                    t.IsCompleted = false;
                    t.Task = null;
                });
            }

            _logger.LogDebug($"Parsed project '{project.ProjectNumber}' - '{project.Status.Code}'", project);

            return project;
        }

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

            // Update all associated properties with the project number.
            foreach (var project in projects)
            {
                foreach (var projectProperty in project.Properties)
                {
                    if (projectProperty.PropertyType == Entity.PropertyTypes.Land)
                    {
                        var parcel = _adminService.Parcel.Find(projectProperty.ParcelId);
                        parcel.UpdateProjectNumbers(project.ProjectNumber);
                        _adminService.Parcel.Update(parcel);
                    }
                    else
                    {
                        var building = _adminService.Building.Find(projectProperty.BuildingId);
                        building.UpdateProjectNumbers(project.ProjectNumber);
                        _adminService.Building.Update(building);
                    }
                }
            }
        }

        /// <summary>
        /// Add a snapshot for the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="model"></param>
        /// <param name="metadata"></param>
        private void AddSnapshot(Entity.Project project, Model.ImportProjectModel model, Entity.Models.DisposalProjectSnapshotMetadata metadata)
        {
            var today = model.SnapshotOn ?? DateTime.Today.ToUniversalTime(); // Allows for all imports done on the same day to create the same snapshot time.
            metadata.NetProceeds = model.PriorNetProceeds; // Temporarily set it to the prior amount for the snapshot.
            var snapshot = new Entity.ProjectSnapshot(project)
            {
                SnapshotOn = today,
                Metadata = JsonSerializer.Serialize(metadata, _serializerOptions)
            };
            project.Snapshots.Add(snapshot);
            metadata.NetProceeds = model.NetProceeds; // Set it back to the current value.
        }

        /// <summary>
        /// Generate and add a project report that will contain any snapshots generated for the specified 'from' date and time.
        /// </summary>
        /// <param name="from">The date and time of the prior snapshots</param>
        private void AddProjectReport(DateTime from)
        {
            // Find any reports that are linked to the 'from' date and update them.
            var reports = _service.ProjectReport.GetAll().Where(r => r.From == from).ToArray();
            if (reports.Any())
            {
                foreach (var report in reports)
                {
                    report.To = DateTime.UtcNow;
                    _service.ProjectReport.Update(report);
                }
            }
            else
            {
                var report = new Entity.ProjectReport(Entity.ReportTypes.SPL, $"Project Import - {DateTime.UtcNow}", from, DateTime.UtcNow);
                _service.ProjectReport.Add(report);
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
                        "Business Case Comments" => Entity.NoteTypes.Private,
                        "Business Case Submitted" => Entity.NoteTypes.Private,
                        "Clearance Letter Issued" => Entity.NoteTypes.Private,
                        "Interest from Enhanced Referral" => Entity.NoteTypes.AgencyInterest,
                        "Appraisal Date" => Entity.NoteTypes.Appraisal,
                        "Assessed & Appraised Comments" => Entity.NoteTypes.Appraisal,
                        "Weekly Review" => Entity.NoteTypes.Reporting,
                        _ => Entity.NoteTypes.General
                    };
                }

                var projectNote = project.Notes.FirstOrDefault(n => n.NoteType == type);
                if (projectNote == null)
                {
                    project.Notes.Add(new Entity.ProjectNote(project, type, note));
                }
                else
                {
                    if (!String.IsNullOrWhiteSpace(projectNote.Note))
                        projectNote.Note += $"{Environment.NewLine}{Environment.NewLine}{noteType}{Environment.NewLine}{note}";
                    else
                        projectNote.Note = note;
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
                project.AddProperty(parcel).ForEach(p =>
                {
                    p.Project = null;
                    p.Parcel = null; // Need to do this so that it isn't reattached.
                });
                var buildings = parcel.Buildings.Select(b => b.Building).ToArray();
                project.AddProperty(buildings).ForEach(b =>
                {
                    b.Project = null;
                    b.Building = null; // Need to do this so that it isn't reattached.
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
            return _adminService.ProjectRisk.Get(_risks.FirstOrDefault(r => r.Name.ToLower() == value?.ToLower())?.Id ?? throw new KeyNotFoundException($"Risk '{value}' does not exist."));
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
            else tier = _tiers.FirstOrDefault(t => t.Id == 1);

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

