using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Report;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class ReportControllerTest
    {
        #region Data
        #endregion

        #region Constructors
        public ReportControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetProject
        [Fact]
        public void GetReport_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReport = EntityHelper.CreateProjectReport(1, "test project report");
            service.Setup(m => m.ProjectReport.Get(It.IsAny<int>())).Returns(projectReport);

            // Act
            var result = controller.GetProjectReport(projectReport.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectReportModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectReportModel>(projectReport), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.ProjectReport.Get(projectReport.Id), Times.Once());
        }

        [Fact]
        public void GetReports_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReports = EntityHelper.CreateProjectReports(1, 2);
            service.Setup(m => m.ProjectReport.GetAll()).Returns(projectReports);

            // Act
            var result = controller.GetProjectReports();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<Model.ProjectReportModel>>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectReportModel[]>(projectReports), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.ProjectReport.GetAll(), Times.Once());
        }

        [Fact]
        public void GetReport_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReport = EntityHelper.CreateProjectReport(1, "test");
            projectReport.To = DateTime.Now;
            projectReport.From = DateTime.Now.AddDays(-1);
            projectReport.IsFinal = true;

            service.Setup(m => m.ProjectReport.Get(It.IsAny<int>())).Returns(projectReport);

            // Act
            var result = controller.GetProjectReport(projectReport.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectReportModel>(actionResult.Value);
            Assert.Equal(projectReport.Id, actualResult.Id);
            Assert.Equal(projectReport.Name, actualResult.Name);
            Assert.Equal(projectReport.To, actualResult.To);
            Assert.Equal(projectReport.From, actualResult.From);
            Assert.Equal(projectReport.IsFinal, actualResult.IsFinal);
        }
        #endregion

        #region GetProjectReportSnapshots
        [Fact]
        public void GetReportSnapshots_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectSnapshots = EntityHelper.CreateProjectSnapshots(1, 2);
            service.Setup(m => m.ProjectReport.GetSnapshots(It.IsAny<int>())).Returns(projectSnapshots);

            // Act
            var result = controller.GetProjectReportSnapshots(1);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<Model.ProjectSnapshotModel>>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectSnapshotModel[]>(projectSnapshots), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.ProjectReport.GetSnapshots(1), Times.Once());
        }

        [Fact]
        public void GetReportSnapshots_ByReport_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectSnapshots = EntityHelper.CreateProjectSnapshots(1, 2);
            var projectReport = EntityHelper.CreateProjectReport(1);
            service.Setup(m => m.ProjectReport.GetSnapshots(It.IsAny<ProjectReport>())).Returns(projectSnapshots);

            // Act
            var result = controller.GetProjectReportSnapshots(1, mapper.Map<Model.ProjectReportModel>(projectReport));

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<Model.ProjectSnapshotModel>>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectSnapshotModel[]>(projectSnapshots), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.ProjectReport.GetSnapshots(It.IsAny<ProjectReport>()), Times.Once());
        }
        #endregion

        #region AddReport
        [Fact]
        public void AddReport_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReport = EntityHelper.CreateProjectReport(1);
            service.Setup(m => m.ProjectReport.Add(It.IsAny<Entity.ProjectReport>())).Returns(projectReport);
            var model = mapper.Map<Model.ProjectReportModel>(projectReport);

            // Act
            var result = controller.AddProjectReport(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualProject = Assert.IsType<Model.ProjectReportModel>(actionResult.Value);
            service.Verify(m => m.ProjectReport.Add(It.IsAny<Entity.ProjectReport>()), Times.Once());
        }
        #endregion

        #region UpdateReport
        [Fact]
        public void UpdateReport_SuccessAsync()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReport = EntityHelper.CreateProjectReport(1);
            service.Setup(m => m.ProjectReport.Update(It.IsAny<Entity.ProjectReport>())).Returns(projectReport);
            var model = mapper.Map<Model.ProjectReportModel>(projectReport);

            // Act
            var result = controller.UpdateProjectReport(projectReport.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectReportModel>(actionResult.Value);
            service.Verify(m => m.ProjectReport.Update(It.IsAny<Entity.ProjectReport>()), Times.Once());
        }
        #endregion

        #region DeleteReport
        [Fact]
        public void DeleteReport_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ReportController>(Permissions.ReportsSpl);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var projectReport = EntityHelper.CreateProjectReport(1);
            service.Setup(m => m.ProjectReport.Remove(It.IsAny<Entity.ProjectReport>()));
            var modelToDelete = mapper.Map<Model.ProjectReportModel>(projectReport);

            // Act
            var result = controller.DeleteProjectReport(projectReport.Id, modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectReportModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ProjectReportModel>(projectReport), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.ProjectReport.Remove(It.IsAny<Entity.ProjectReport>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
