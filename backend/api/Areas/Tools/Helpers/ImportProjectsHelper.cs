using Model = Pims.Api.Areas.Tools.Models.Import;
using System.Collections.Generic;
using System.Linq;
using Pims.Dal.Services.Admin;
using Microsoft.Extensions.Logging;
using Entity = Pims.Dal.Entities;
using System;
using Pims.Core.Extensions;

namespace Pims.Api.Areas.Tools.Helpers
{
    /// <summary>
    /// ImportProjectsHelper class, provides a helper to import projects into PIMS.
    /// </summary>
    public class ImportProjectsHelper
    {
        #region Variables
        private readonly IPimsAdminService _service;
        private readonly ILogger _logger;
        private readonly IList<Entity.Workflow> _workflows;
        private readonly IList<Entity.ProjectStatus> _status;
        private readonly IList<Entity.ProjectRisk> _risks;
        private readonly IList<Entity.Agency> _agencies;
        private readonly IList<Entity.TierLevel> _tiers;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportProjectsHelper, initializes with specified arguments.
        /// </summary>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ImportProjectsHelper(IPimsAdminService service, ILogger logger)
        {
            _service = service;
            _logger = logger;

            _workflows = _service.Workflow.GetAll().ToArray();
            _status = _service.ProjectStatus.GetAll().ToArray();
            _risks = _service.ProjectRisk.GetAll().ToArray();
            _agencies = _service.Agency.GetAll().ToArray();
            _tiers = _service.TierLevel.GetAll().ToArray();
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
            var projects = models.Select(p => Merge(_service.Project.Get(p.ProjectNumber), p, stopOnError, defaults)).NotNull();

            return _service.Project.Add(projects).ToArray();
        }
        #endregion

        #region Helpers
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
                        if (modelValue == null || modelValue.Equals(prop.PropertyType.GetDefault()))
                        {
                            var value = Convert.ChangeType(keyValue[1], prop.PropertyType);
                            prop.SetValue(model, value);
                        }
                    }
                }

                _logger.LogDebug($"Importing Project '{model.ProjectNumber}', agency:'{model.Agency}', workflow:'{model.Workflow}', status:'{model.Status}'");

                project ??= new Entity.Project();

                project.ProjectNumber = model.ProjectNumber;
                project.Name = model.Description;
                project.Description = model.Description;
                project.Manager = model.Manager;
                project.ActualFiscalYear = model.ActualFiscalYear;
                project.ReportedFiscalYear = model.ReportedFiscalYear;

                project.Agency = GetAgency(model.Agency);
                project.AgencyId = project.Agency.Id;
                project.Workflow = GetWorkflow(model.Workflow);
                project.WorkflowId = project.Workflow.Id;
                project.Status = GetStatus(model.Status);
                project.StatusId = project.Status.Id;
                project.TierLevel = GetTier(model.Estimated, project.Properties.Count()); // TODO: Need to import or link project properties.
                project.TierLevelId = project.TierLevel.Id;
                project.Risk = GetRisk(model.Risk);
                project.RiskId = project.Risk.Id;

                project.OcgFinancialStatement = model.OcgFinancialStatement;
                project.NetBook = model.NetBook;
                project.Estimated = model.Estimated;
                project.ProgramCost = model.ProgramCost;
                project.SalesCost = model.SalesCost;
                project.InterestComponent = model.InterestComponent;
                project.NetProceeds = model.NetProceeds;
                project.GainLoss = model.GainLoss;
                project.SaleWithLeaseInPlace = model.SaleWithLeaseInPlace;

                if (model.PriorNetProceeds.HasValue)
                {
                    project.Snapshots.Add(new Entity.ProjectSnapshot(project) { NetProceeds = model.PriorNetProceeds.Value });
                }

                project.MarketedOn = model.MarketedOn;
                project.CompletedOn = model.CompletedOn;

                project.PrivateNote = model.PrivateNote;

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

                if (!String.IsNullOrWhiteSpace(model.FinancialNote))
                {
                    var financialNote = project.Notes.FirstOrDefault(n => n.NoteType == Entity.NoteTypes.Financial);
                    if (financialNote == null)
                    {
                        project.Notes.Add(new Entity.ProjectNote(project, Entity.NoteTypes.Financial, model.FinancialNote));
                    }
                    else
                    {
                        financialNote.Note = model.FinancialNote;
                    }
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
        /// Get the project risk based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.ProjectRisk GetRisk(string value)
        {
            return _risks.FirstOrDefault(r => r.Name.ToLower() == value.ToLower()) ?? throw new KeyNotFoundException($"Risk '{value}' does not exist.");
        }

        /// <summary>
        /// Get the workflow based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.Workflow GetWorkflow(string value)
        {
            return _workflows.FirstOrDefault(w => w.Code == value) ?? throw new KeyNotFoundException($"Workflow '{value}' does not exist.");
        }

        /// <summary>
        /// Get the project status based on the 'value' provided.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.ProjectStatus GetStatus(string value)
        {
            return _status.FirstOrDefault(a => a.Code == value) ?? throw new KeyNotFoundException($"Project status '{value}' does not exist.");
        }

        /// <summary>
        /// Get the tier level based on the value and the number of properties.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        private Entity.TierLevel GetTier(decimal value, int properties)
        {
            if (value >= 10000000m && properties > 1) return _tiers.FirstOrDefault(t => t.Id == 4);
            else if (value >= 10000000m) return _tiers.FirstOrDefault(t => t.Id == 3);
            else if (value >= 1000000m) return _tiers.FirstOrDefault(t => t.Id == 2);
            return _tiers.FirstOrDefault(t => t.Id == 1);
        }

        /// <summary>
        /// Get the agency for the specified code 'value'.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private Entity.Agency GetAgency(string value)
        {
            return _agencies.FirstOrDefault(a => a.Name == value || a.Code == value) ?? throw new KeyNotFoundException($"Agency '{value}' does not exist.");
        }
        #endregion
    }
}

