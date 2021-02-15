using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
    /// ProjectReportService class, provides a service layer to interact with project reports and report snapshots within the datasource.
    /// </summary>
    public class ProjectReportService : BaseService<ProjectReport>, IProjectReportService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectReportService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectReportService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ProjectService> logger) : base(dbContext, user, service, logger)
        {
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
                .Include(s => s.Project).ThenInclude(p => p.Risk)
                .Where(s => s.SnapshotOn == report.From || s.SnapshotOn == report.To)
                .ToArray();
            var toSnapshots = currentSnapshots.Where(s => s.SnapshotOn == report.To);

            //This may occur if a user refreshes their report, and changes the 'From' date without saving.
            if (toSnapshots.Count() == 0)
            {
                return GenerateSnapshots(report.From, (DateTime)report.To);
            }

            var fromSnapshots = currentSnapshots.Where(s => s.SnapshotOn == report.From).ToDictionary(s => (int?)s.ProjectId, s => s);
            if (fromSnapshots.Count() == 0) throw new KeyNotFoundException("If specified report FROM value must return valid snapshots");

            foreach (ProjectSnapshot snapshot in toSnapshots)
            {
                var metadata = !String.IsNullOrWhiteSpace(snapshot.Metadata) ? this.Context.Deserialize<DisposalProjectSnapshotMetadata>(snapshot.Metadata ?? "{}") : new DisposalProjectSnapshotMetadata();
                var prevSnapshot = fromSnapshots.GetValueOrDefault(snapshot.ProjectId);
                var prevMetadata = prevSnapshot != null ? this.Context.Deserialize<DisposalProjectMetadata>(prevSnapshot.Metadata ?? "{}") : null;
                metadata.BaselineIntegrity = (metadata?.NetProceeds ?? 0) - (prevMetadata?.NetProceeds ?? 0);
                snapshot.Metadata = this.Context.Serialize(metadata);
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
                .Include(s => s.Project).ThenInclude(p => p.Risk)
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
                    .Where(r => r.ReportType == ReportTypes.SPL)
                    .OrderByDescending(r => r.IsFinal)
                    .ThenByDescending(r => r.To)
                    .FirstOrDefault();
                report.From = mostRecentReport?.To;
            }
            this.Context.Add(report);

            this.Context.ProjectSnapshots.AddRange(GenerateSnapshots(report.From, (DateTime)report.To));

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
            var isSPLAdmin = this.User.HasPermission(Permissions.ReportsSplAdmin);

            var originalReport = this.Context.ProjectReports
                .SingleOrDefault(p => p.Id == report.Id) ?? throw new KeyNotFoundException();

            if ((!originalReport.IsFinal && report.IsFinal && !isSPLAdmin) || (originalReport.IsFinal && !report.IsFinal && !isSPLAdmin)) throw new NotAuthorizedException($"You do not have permissions to update the Is Final option.");
            if (report.To == null) throw new ArgumentNullException(nameof(report.To));
            if (originalReport.IsFinal && report.IsFinal) throw new InvalidOperationException($"Unable to update FINAL project reports.");
            if (report.From == report.To) throw new InvalidOperationException($"Project report start and end dates cannot be the same.");

            // If the report 'To' date has changed regenerate all the snapshots based on that date.
            var originalTo = (DateTime?)this.Context.Entry(originalReport).OriginalValues[nameof(ProjectReport.To)];
            if (!originalTo.Equals(report.To))
            {
                var snapshots = GenerateSnapshots(report.From, report.To.Value, originalTo);
                this.Context.ProjectSnapshots.UpdateRange(snapshots.Where(s => s.Id != 0));
                this.Context.ProjectSnapshots.AddRange(snapshots.Where(s => s.Id == 0));
            }

            this.Context.Entry(originalReport).CurrentValues.SetValues(report);
            this.Context.SetOriginalRowVersion(originalReport);

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
            report.To = DateTime.UtcNow;
            this.Update(report);
            return this.GetSnapshots(reportId);
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
            if (report.IsFinal) this.User.ThrowIfNotAuthorized(Permissions.ReportsSplAdmin);
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            if (report?.Id == null) throw new ArgumentNullException();

            var originalReport = this.Context.ProjectReports
                .SingleOrDefault(p => p.Id == report.Id) ?? throw new KeyNotFoundException();
            if (originalReport.IsFinal) throw new InvalidOperationException($"Unable to delete FINAL project reports.");

            // Remove all snapshots associated with this report.
            var snapshots = this.Context.ProjectSnapshots.Where(s => s.SnapshotOn == originalReport.To.Value).ToArray();

            this.Context.ProjectSnapshots.RemoveRange(snapshots);
            this.Context.ProjectReports.Remove(originalReport);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Add a project and snapshots to the datasource.
        /// This provides a way to manually generate snapshots with specific projects and historical values.
        /// Requires a valid 'report.To' date.
        /// </summary>
        /// <param name="report"></param>
        /// <param name="snapshots"></param>
        public ProjectReport Add(ProjectReport report, IEnumerable<ProjectSnapshot> snapshots)
        {
            this.User.ThrowIfNotAuthorized(Permissions.ReportsSpl);
            if (!report.To.HasValue) throw new InvalidOperationException("Argument 'report.To' must have a valid date.");
            if (report.From.HasValue && report.From > report.To) throw new InvalidOperationException("Argument 'report.From' must be equal to or greater than 'report.To'.");

            foreach (var snapshot in snapshots)
            {
                // All the snapshot dates must match the reported 'to' date.
                // Regrettably I had to manually recreate this from the mapped objects because EF is attempting to set the primary key with the mapped objects.
                var snap = new ProjectSnapshot()
                {
                    ProjectId = snapshot.ProjectId,
                    SnapshotOn = report.To.Value,
                    Assessed = snapshot.Assessed,
                    Appraised = snapshot.Appraised,
                    Market = snapshot.Market,
                    NetBook = snapshot.NetBook,
                    Metadata = snapshot.Metadata
                };
                this.Context.ProjectSnapshots.Add(snap);
            }

            this.Context.Add(report);
            this.Context.CommitTransaction();

            return report;
        }

        #region Helpers
        /// <summary>
        /// Generate snapshots for all SPL projects.
        /// To compare prior snapshots use the specified 'from' date.
        /// To update prior snapshots use the specified 'originalTo' date.
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="originalTo"></param>
        /// <returns></returns>
        private IEnumerable<ProjectSnapshot> GenerateSnapshots(DateTime? from, DateTime to, DateTime? originalTo = null)
        {
            // Only fetch projects in SPL that have not been cancelled.
            var splProjects = this.Context.Projects
                .Include(p => p.Agency)
                .Include(p => p.Status)
                .Include(p => p.Risk)
                .Where(p => p.Workflow.Code == "SPL" && p.Status.Code != "CA" && p.Status.Code != "T-GRE");
            // TODO: Because project status codes could change in the future, this should be updated to not be magic strings.

            var fromSnapshots = new Dictionary<int, ProjectSnapshot>();
            if (from.HasValue)
            {
                fromSnapshots = this.Context.ProjectSnapshots
                    .Where(s => s.SnapshotOn == from)
                    .ToDictionary(s => s.ProjectId, s => s);
            }

            var toSnapshots = new Dictionary<int, ProjectSnapshot>();
            if (originalTo.HasValue)
            {
                toSnapshots = this.Context.ProjectSnapshots
                    .Where(s => s.SnapshotOn == originalTo)
                    .ToDictionary(s => s.ProjectId, s => s);
            }

            var projectSnapshots = new HashSet<ProjectSnapshot>();

            foreach (Project project in splProjects)
            {
                var metadata = !String.IsNullOrWhiteSpace(project.Metadata) ? this.Context.Deserialize<DisposalProjectSnapshotMetadata>(project.Metadata ?? "{}") : new DisposalProjectSnapshotMetadata();
                var prevSnapshot = fromSnapshots.GetValueOrDefault(project.Id);
                var prevMetadata = prevSnapshot != null ? this.Context.Deserialize<DisposalProjectSnapshotMetadata>(prevSnapshot.Metadata ?? "{}") : new DisposalProjectSnapshotMetadata();

                metadata.BaselineIntegrity = (metadata?.NetProceeds ?? 0) - (prevMetadata?.NetProceeds ?? 0);

                var snapshot = toSnapshots.GetValueOrDefault(project.Id) ?? new ProjectSnapshot(project);
                snapshot.SnapshotOn = to;
                snapshot.Metadata = this.Context.Serialize(metadata);
                projectSnapshots.Add(snapshot);
            }
            return projectSnapshots.AsEnumerable();
        }
        #endregion
        #endregion
    }
}
