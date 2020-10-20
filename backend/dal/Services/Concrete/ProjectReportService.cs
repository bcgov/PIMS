using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
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
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

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
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var report = this.Context.ProjectReports
                .FirstOrDefault(p => p.Id == reportId) ?? throw new KeyNotFoundException();

            return report;
        }

        /// <summary>
        /// Get all project snapshots matching either the 'To' or 'From' dates of the passed report.
        /// </summary>
        /// <param name="reportId"></param>
        /// <exception cref="ArgumentNullException">Argument 'reportId' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project report does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view snapshots.</exception>
        /// <returns></returns>
        public IEnumerable<ProjectSnapshot> GetSnapshots(int reportId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var report = this.Context.ProjectReports
                .FirstOrDefault(p => p.Id == reportId) ?? throw new KeyNotFoundException();

            var snapshots = this.Context.ProjectSnapshots.Where(s => s.SnapshotOn == report.From || s.SnapshotOn == report.To);

            return snapshots;
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
            if (report.To == null)
            {
                report.To = DateTime.UtcNow;
            }
            var mostRecentReport = this.Context.ProjectReports
                .Where(r => r.ReportTypeId == ReportTypes.SPL)
                .OrderByDescending(r => r.To)
                .FirstOrDefault();
            report.From = mostRecentReport?.To;
            this.Context.Add(report);

            this.Context.ProjectSnapshots.AddRange(GenerateSnapshots((DateTime)report.To));

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
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var originalReport = this.Context.ProjectReports
                .SingleOrDefault(p => p.Id == report.Id) ?? throw new KeyNotFoundException();

            if (originalReport.To == null) throw new ArgumentNullException();
            if (originalReport.IsFinal) throw new InvalidOperationException($"Unable to update FINAL project reports.");
            if (originalReport.From == originalReport.To) throw new InvalidOperationException($"Project report start and end dates cannot be the same.");

            this.Context.Entry(originalReport).CurrentValues.SetValues(report);

            //If the report 'To' date has changed regenerate all the snapshots based on that date.
            if(!originalReport.To.Equals(report.To))
            {
                this.Context.ProjectSnapshots.AddRange(GenerateSnapshots((DateTime)report.To));
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
        public IEnumerable<ProjectSnapshot> Refresh()
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            return GenerateSnapshots(DateTime.UtcNow);
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
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

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
        private IEnumerable<ProjectSnapshot> GenerateSnapshots(DateTime to)
        {
            var splProjects = this.Context.Projects
                .Where(p => p.Workflow.Code == "SPL") ?? throw new KeyNotFoundException();

            IEnumerable<ProjectSnapshot> projectSnapshots = new ProjectSnapshot[0];
            foreach (Project project in splProjects)
            {
                this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

                ProjectSnapshot snapshot = new ProjectSnapshot(project);
                snapshot.SnapshotOn = to;

                projectSnapshots = projectSnapshots.Append(snapshot);
            }
            return projectSnapshots;
        }

        #endregion
    }
}
