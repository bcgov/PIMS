using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
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
    /// ProjectReportService class, provides a service layer to interact with project reports and report snapshots within the datasource.
    /// </summary>
    public class ProjectReportService : BaseService<ProjectReport>, IProjectReportService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectReportService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="notifyService"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        public ProjectReportService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, INotificationService notifyService, IOptions<PimsOptions> options, ILogger<ProjectService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get all of the project reports.
        /// </summary>
        /// <exception cref="NotAuthorizedException">User does not have permission to view reports.</exception>
        /// <returns></returns>
        public IEnumerable<ProjectReport> GetAll()
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);

            var snapshots = this.Context.ProjectReports;

            return snapshots;
        }

        /// <summary>
        /// Get the project report for the specified 'id'.
        /// </summary>
        /// <param name="reportId"></param>
        /// <exception cref="ArgumentNullException">Argument 'reportId' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project report does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view report.</exception>
        /// <returns></returns>
        public ProjectReport Get(int reportId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);

            var report = this.Context.ProjectReports
                .FirstOrDefault(p => p.Id == reportId) ?? throw new KeyNotFoundException();

            return report;
        }

        /// <summary>
        /// Get all project snapshots matching either the 'To' or 'From' dates of the passed report.
        /// The 'To' value may not correspond to any saved values, in this case, generate new snapshot values.
        /// Since the 'From' value may correspond to a different 'From' value then what was previously used for this report, all of the baseline integrity values must be re-evaluated.
        /// </summary>
        /// <param name="report"></param>
        /// <exception cref="ArgumentNullException">Argument 'report.To' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project report does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view snapshots.</exception>
        /// <returns></returns>
        public IEnumerable<ProjectSnapshot> GetSnapshots(ProjectReport report)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            if (report?.To == null) throw new ArgumentNullException();

            var currentSnapshots = this.Context.ProjectSnapshots
                .Include(s => s.Project).ThenInclude(p => p.Agency)
                .Include(s => s.Project).ThenInclude(p => p.Status)
                .Where(s => s.SnapshotOn == report.From || s.SnapshotOn == report.To)
                .ToArray();
            var toSnapshots = currentSnapshots.Where(s => s.SnapshotOn == report.To);

            //This may occur if a user refreshes their report, and changes the 'From' date without saving.
            if (toSnapshots.Count() == 0)
            {
                return GenerateSnapshots((DateTime) report.To, report.From);
            }

            var fromSnapshots = currentSnapshots.Where(s => s.SnapshotOn == report.From).ToDictionary(s => (int?)s.ProjectId, s => s);
            if (fromSnapshots.Count() == 0) throw new KeyNotFoundException("If specified report FROM value must return valid snapshots");

            foreach (ProjectSnapshot snapshot in toSnapshots)
            {
                var previousSnapshot = fromSnapshots.FirstOrDefault(s => s.Key == snapshot.ProjectId);
                snapshot.BaselineIntegrity = (snapshot?.NetProceeds ?? 0) - (previousSnapshot.Value?.NetProceeds ?? 0);
            }

            return toSnapshots;
        }

        /// <summary>
        /// Get all project snapshots matching either the 'To' date of the passed report.
        /// </summary>
        /// <param name="reportId"></param>
        /// <exception cref="ArgumentNullException">Argument 'reportId' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project report does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view snapshots.</exception>
        /// <returns></returns>
        public IEnumerable<ProjectSnapshot> GetSnapshots(int reportId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);

            var report = this.Context.ProjectReports
                .FirstOrDefault(p => p.Id == reportId) ?? throw new KeyNotFoundException();

            return this.Context.ProjectSnapshots
                .Include(s => s.Project).ThenInclude(p => p.Agency)
                .Include(s => s.Project).ThenInclude(p => p.Status)
                .Where(s => s.SnapshotOn == report.To)
                .ToArray();
        }

        /// <summary>
        /// Add the specified report to the datasource.
        /// The 'From' date is set to the 'To' date of the most recent report, if one exists.
        /// For every SPL project in the system, a new Snapshot is generated using current project data and a 'snapshotOn' time equal to the newly created reports 'To' date.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'report' is required.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to add report.</exception>
        /// <returns></returns>
        public ProjectReport Add(ProjectReport report)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            if (report.To == null)
            {
                report.To = DateTime.UtcNow;
            }
            if (report.From == null)
            {
                var mostRecentReport = this.Context.ProjectReports
                    .Where(r => r.ReportTypeId == ReportTypes.SPL)
                    .OrderByDescending(r => r.IsFinal)
                    .ThenByDescending(r => r.To)
                    .FirstOrDefault();
                report.From = mostRecentReport?.To;
            }
            this.Context.Add(report);

            this.Context.ProjectSnapshots.AddRange(GenerateSnapshots((DateTime)report.To, report.From));

            this.Context.CommitTransaction();

            return report;
        }

        /// <summary>
        /// Update the specified project report metadata in the datasource.
        /// If the project 'To' date has changed, 
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'report' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project report rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit report.</exception>
        /// <returns></returns>
        public ProjectReport Update(ProjectReport report)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);

            var originalReport = this.Context.ProjectReports
                .SingleOrDefault(p => p.Id == report.Id) ?? throw new KeyNotFoundException();

            if (originalReport.To == null) throw new ArgumentNullException();
            if (originalReport.IsFinal && report.IsFinal) throw new InvalidOperationException($"Unable to update FINAL project reports.");
            if (originalReport.From == originalReport.To) throw new InvalidOperationException($"Project report start and end dates cannot be the same.");

            this.Context.Entry(originalReport).CurrentValues.SetValues(report);
            this.Context.SetOriginalRowVersion(originalReport);

            //If the report 'To' date has changed regenerate all the snapshots based on that date.
            if(!originalReport.To.Equals(report.To))
            {
                this.Context.ProjectSnapshots.AddRange(GenerateSnapshots((DateTime)report.To, report.From));
            }

            this.Context.SaveChanges();
            this.Context.CommitTransaction();

            return Get(originalReport.Id);
        }

        /// <summary>
        /// Generate an updated list of snapshots based on current project data.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="NotAuthorizedException">User does not have permission to get refreshed snapshots.</exception>
        /// <returns></returns>
        public IEnumerable<ProjectSnapshot> Refresh(int reportId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            var report = Get(reportId);

            var generatedSnapshots = GenerateSnapshots(DateTime.UtcNow, report.From);

            return generatedSnapshots;
        }

        /// <summary>
        /// Remove the specified report from the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'report' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project report rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project report does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to delete report.</exception>
        /// <returns></returns>
        public void Remove(ProjectReport report)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            if (report?.Id == null) throw new ArgumentNullException();

            var originalReport = this.Context.ProjectReports
                .SingleOrDefault(p => p.Id == report.Id) ?? throw new KeyNotFoundException();
            if (originalReport.IsFinal) throw new InvalidOperationException($"Unable to delete FINAL project reports.");

            this.Context.ProjectReports.Remove(originalReport);
            this.Context.CommitTransaction();
        }


        /// <summary>
        /// Generate snapshots for all SPL projects using the passed 'to' date as the snapshot date.
        /// </summary>
        /// <param name="to"></param>
        /// <returns></returns>
        private IEnumerable<ProjectSnapshot> GenerateSnapshots(DateTime to, DateTime? from)
        {
            var splProjects = this.Context.Projects
                .Include(p => p.Agency)
                .Include(p => p.Status)
                .Where(p => p.Workflow.Code == "SPL");

            Dictionary<int?, ProjectSnapshot> fromSnapshots = new Dictionary<int?, ProjectSnapshot>();
            if (from != null) {
                fromSnapshots = this.Context.ProjectSnapshots
                    .Include(s => s.Project).ThenInclude(p => p.Agency)
                    .Include(s => s.Project).ThenInclude(p => p.Status)
                    .Where(s => s.SnapshotOn == from)
                    .ToDictionary(s => (int?)s.ProjectId, s => s);
            }

            IEnumerable<ProjectSnapshot> projectSnapshots = new HashSet<ProjectSnapshot>();
            
            foreach (Project project in splProjects)
            {
                JsonConvert.PopulateObject(project.Metadata ?? "{}", project);
                ProjectSnapshot snapshot = new ProjectSnapshot(project);
                snapshot.SnapshotOn = to;
                snapshot.BaselineIntegrity = project.NetProceeds - (fromSnapshots.GetValueOrDefault(project.Id)?.NetProceeds ?? 0);

                projectSnapshots = projectSnapshots.Append(snapshot);
            }
            return projectSnapshots;
        }

        #endregion
    }
}
