using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class ProjectReportServiceTest
    {
        #region Constructors
        public ProjectReportServiceTest() { }
        #endregion

        #region Tests
        #region GetAll
        /// <summary>
        /// User does not have 'reports-spl' claim.
        /// </summary>
        [Fact]
        public void GetAll_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new ProjectFilter();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetAll());
        }

        [Fact]
        public void GetAll()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            using var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            init.SaveChanges();

            var options = Options.Create(new PimsOptions() { });
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var result = service.GetAll();

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectReport>>(result);
            Assert.NotEmpty(result);
        }
        #endregion

        #region Get Project Report
        /// <summary>
        /// User does not have 'reports-spl' claim.
        /// </summary>
        [Fact]
        public void Get_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var projectReport = EntityHelper.CreateProjectReport(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(projectReport);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// Project Report does not exist.
        /// </summary>
        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var projectReport = EntityHelper.CreateProjectReport(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(projectReport);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(2));
        }

        /// <summary>
        /// Project Report found.
        /// </summary>
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            init.SaveChanges();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            var result = service.Get(projectReport.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(projectReport, result, new ShallowPropertyCompare());
            Assert.NotNull(projectReport.From);
            Assert.NotNull(projectReport.To);
            Assert.NotNull(projectReport.Name);
        }
        #endregion

        #region Get Project Report Snapshots
        /// <summary>
        /// User does not have 'reports-spl' claim.
        /// </summary>
        [Fact]
        public void GetSnapshots_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetSnapshots(1));
        }

        /// <summary>
        /// Project Report does not exist.
        /// </summary>
        [Fact]
        public void GetSnapshots_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.GetSnapshots(2));
        }

        /// <summary>
        /// User does not have 'reports-spl' claim.
        /// </summary>
        [Fact]
        public void GetSnapshots_ByReport_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var projectReport = EntityHelper.CreateProjectReport(1);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetSnapshots(projectReport));
        }

        /// <summary>
        /// Project Report does not exist.
        /// </summary>
        [Fact]
        public void GetSnapshots_ByReport_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            var snapshot = init.CreateProjectSnapshot(1, agency: project.Agency, snapshotOn: projectReport.To);
            snapshot.Project = project;
            init.SaveChanges();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.GetSnapshots(projectReport));
        }

        /// <summary>
        /// Project Report has null to date.
        /// </summary>
        [Fact]
        public void GetSnapshots_ByReport_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var projectReport = EntityHelper.CreateProjectReport(1);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetSnapshots(projectReport));
        }

        /// <summary>
        /// Project Report Snapshots found.
        /// </summary>
        [Fact]
        public void GetSnapshots_ById()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            var snapshot = init.CreateProjectSnapshot(1, agency: project.Agency, snapshotOn: projectReport.To);
            snapshot.Project = project;
            init.SaveChanges();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            var result = service.GetSnapshots(projectReport.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(snapshot, result.First(), new ShallowPropertyCompare());
        }

        /// <summary>
        /// Project Report Snapshots found, and to snapshot and from snapshot used to calculate variance if project id matches.
        /// </summary>
        [Fact]
        public void GetSnapshots_ByReport_Variance()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            var toSnapshot = init.CreateProjectSnapshot(1, agency: project.Agency, snapshotOn: projectReport.To);
            var fromSnapshot = init.CreateProjectSnapshot(2, agency: project.Agency, snapshotOn: projectReport.From);
            toSnapshot.Project = project;
            toSnapshot.ProjectId = project.Id;
            toSnapshot.NetProceeds = 100;
            fromSnapshot.Project = project;
            fromSnapshot.ProjectId = project.Id;
            fromSnapshot.NetProceeds = 10;
            init.SaveChanges();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            var result = service.GetSnapshots(projectReport);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(90, result.First().BaselineIntegrity);
        }

        /// <summary>
        /// Project Report Snapshots found, and to snapshot and from snapshot used to calculate variance if the project ids don't match.
        /// </summary>
        [Fact]
        public void GetSnapshots_ByReport_NoVariance()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var project2 = init.CreateProject(2);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, "name", DateTime.UtcNow, DateTime.UtcNow.AddDays(-1), false, project.Agency);
            var toSnapshot = init.CreateProjectSnapshot(1, agency: project.Agency, snapshotOn: projectReport.To);
            var fromSnapshot = init.CreateProjectSnapshot(2, agency: project.Agency, snapshotOn: projectReport.From);
            toSnapshot.Project = project;
            toSnapshot.ProjectId = project.Id;
            fromSnapshot.Project = project2;
            toSnapshot.NetProceeds = 100;
            init.SaveChanges();

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            var result = service.GetSnapshots(projectReport);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(100, result.First().BaselineIntegrity);
        }
        #endregion

        #region Refresh
        /// <summary>
        /// User with appropriate permission refreshes the snapshots for a report.
        /// </summary>
        [Fact]
        public void Refresh_ProjectReport()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, agency: project.Agency);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var snapshots = service.Refresh(projectReport.Id);

            // Assert
            Assert.NotEmpty(snapshots);
        }

        [Fact]
        public void Refresh_ThrowIfNotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsView);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act Assert
            Assert.Throws<NotAuthorizedException>(() => service.Refresh(1));
        }

        [Fact]
        public void Refresh_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act Assert
            Assert.Throws<KeyNotFoundException>(() => service.Refresh(1));
        }
        #endregion

        #region Add
        /// <summary>
        /// User with appropriate permission successfully adds new project report.
        /// </summary>
        [Fact]
        public void Add_ProjectReport()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            
            init.SetStatus(project, "SPL", "AP-SPL");
            init.SaveChanges();

            var projectReport = EntityHelper.CreateProjectReport(1, agency: project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var result = service.Add(projectReport);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.NotEmpty(snapshots);
        }

        /// <summary>
        /// User with appropriate permission successfully adds new project report with a non-null to date.
        /// </summary>
        [Fact]
        public void Add_ProjectReport_ToDate()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            init.SaveChanges();

            DateTime toDate = DateTime.UtcNow;
            var projectReport = EntityHelper.CreateProjectReport(1, toDate: toDate, agency: project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var result = service.Add(projectReport);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(toDate, result.To);
            Assert.True(result.Id > 0);
            Assert.NotEmpty(snapshots);
            Assert.All<ProjectSnapshot>(snapshots, s => Assert.Equal<DateTime>(toDate, s.SnapshotOn));
        }

        /// <summary>
        /// User with appropriate permission successfully adds new project report with a non-null from date.
        /// </summary>
        [Fact]
        public void Add_ProjectReport_FromDate()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            DateTime fromDate = DateTime.UtcNow;

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var snapshot = init.CreateProjectSnapshot(1, agency: project.Agency);

            init.SetStatus(project, "SPL", "AP-SPL");
            snapshot.SnapshotOn = fromDate;
            snapshot.Project = project;
            snapshot.NetProceeds = 100;
            
            init.SaveChanges();
            var projectReport = EntityHelper.CreateProjectReport(1, fromDate: fromDate, agency: project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var result = service.Add(projectReport);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(fromDate, result.From);
            Assert.True(result.Id > 0);
            Assert.Equal(snapshots.First().BaselineIntegrity, -100);
        }

        /// <summary>
        /// User with appropriate permission successfully adds new project report with a null from date and a previous report exists in the system.
        /// </summary>
        [Fact]
        public void Add_ProjectReport_PreviousReport()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            DateTime fromDate = DateTime.UtcNow;

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var report = init.CreateProjectReport(1, agency: project.Agency);
            var snapshot = init.CreateProjectSnapshot(1, agency: project.Agency);

            init.SetStatus(project, "SPL", "AP-SPL");
            report.IsFinal = true;
            report.To = DateTime.UtcNow;
            snapshot.SnapshotOn = report.To.Value;
            snapshot.NetProceeds = 100;
            snapshot.Project = project;

            init.SaveChanges();
            var projectReport = EntityHelper.CreateProjectReport(2, agency: project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var result = service.Add(projectReport);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal(snapshots.First().BaselineIntegrity, -100);
        }

        [Fact]
        public void Add_Permission_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsView);
            var projectReport = EntityHelper.CreateProjectReport(2);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Add(projectReport));
        }
        #endregion

        #region Update

        /// <summary>
        /// User with appropriate permission successfully updates project report.
        /// </summary>
        [Fact]
        public void Update()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, agency: project.Agency);
            projectReport.To = DateTime.UtcNow;
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);
            
            // Act
            var report = service.Get(projectReport.Id);
            report.Name = "A new name";
            report.IsFinal = false;
            report.From = DateTime.UtcNow.AddHours(-1);
            var result = service.Update(report);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            result.Should().Equals(report);
        }

        /// <summary>
        /// User with appropriate permission successfully updates project report with a new To Date. This should regenerate the snapshots for the new date.
        /// </summary>
        [Fact]
        public void Update_NewToDate()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, agency: project.Agency);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var reportToUpdate = EntityHelper.CreateProjectReport(projectReport.Id);
            reportToUpdate.To = DateTime.UtcNow.AddHours(1);
            var result = service.Update(reportToUpdate);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            result.Should().Equals(reportToUpdate);
            Assert.NotEmpty(snapshots);
            Assert.All<ProjectSnapshot>(snapshots, s => Assert.Equal<DateTime>(reportToUpdate.To.Value, s.SnapshotOn));
        }

        /// <summary>
        /// User with appropriate permission successfully updates project report From date. this should cause variance calculations to be re-evaluated.
        /// </summary>
        [Fact]
        public void Update_FromDate()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var oldReport = init.CreateProjectReport(1, agency: project.Agency);
            var projectReport = init.CreateProjectReport(2, agency: project.Agency);
            var snapshot = init.CreateProjectSnapshot(1, agency: project.Agency);

            init.SetStatus(project, "SPL", "AP-SPL");
            oldReport.IsFinal = true;
            oldReport.To = DateTime.UtcNow;
            snapshot.SnapshotOn = oldReport.To.Value;
            snapshot.NetProceeds = 100;
            snapshot.Project = project;
            projectReport.To = DateTime.UtcNow.AddDays(1);

            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            var reportToUpdate = EntityHelper.CreateProjectReport(projectReport.Id, toDate: DateTime.UtcNow.AddDays(2));
            reportToUpdate.From = oldReport.To;
            var result = service.Update(reportToUpdate);
            var snapshots = service.GetSnapshots(result.Id);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.NotEmpty(snapshots);
            Assert.Equal(snapshots.First().BaselineIntegrity, -100);
        }

        [Fact]
        public void Update_Permission_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsView);
            var projectReport = EntityHelper.CreateProjectReport(2);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(projectReport));
        }

        [Fact]
        public void Update_Permission_Throws_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var projectReport = EntityHelper.CreateProjectReport(2);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => service.Update(projectReport));
        }

        [Fact]
        public void Update_NullTo_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            init.CreateProjectReport(1, toDate: null, agency: project.Agency);
            init.SaveChanges();
            var projectReport = EntityHelper.CreateProjectReport(1, toDate: null, agency: project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.Update(projectReport));
        }

        [Fact]
        public void Update_IsFinal_Throws_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            init.CreateProjectReport(1, toDate: null, agency: project.Agency, isFinal: true);
            init.SaveChanges();
            var projectReport = EntityHelper.CreateProjectReport(1, toDate: DateTime.UtcNow, agency: project.Agency, isFinal: true);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(projectReport));
        }

        [Fact]
        public void Update_ToDates_Throws_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);

            init.SetStatus(project, "SPL", "AP-SPL");
            var toDate = DateTime.UtcNow;
            var report = init.CreateProjectReport(1, toDate: toDate, fromDate: toDate, agency: project.Agency);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(report));
        }
        #endregion

        #region Remove
        /// <summary>
        /// Project Report does not exist.
        /// </summary>
        [Fact]
        public void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);
            var find = EntityHelper.CreateProjectReport(1);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
           Assert.Throws<KeyNotFoundException>(() =>
                service.Remove(find));
        }

        /// <summary>
        /// User does not have 'spl-reports' claim.
        /// </summary>
        [Fact]
        public void Remove_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsView);
            var find = EntityHelper.CreateProjectReport(1);

            var service = helper.CreateService<ProjectReportService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                 service.Remove(find));
        }

        /// <summary>
        /// User has permissions and removes a project report by id.
        /// </summary>
        [Fact]
        public void Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ReportsSpl);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SetStatus(project, "SPL", "AP-SPL");
            var projectReport = init.CreateProjectReport(1, agency: project.Agency);
            projectReport.To = DateTime.UtcNow;
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectReportService>(user, options);

            // Act
            service.Remove(projectReport);

            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(projectReport.Id));
        }
        #endregion
        #endregion
    }
}
