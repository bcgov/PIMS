using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class DisposeControllerTest
    {
        #region Data
        public static IEnumerable<object[]> ProjectFilters =>
            new List<object[]>
            {
                new object[] { new ProjectFilter() { Agencies = new int[] { 3 } } },
                new object[] { new ProjectFilter() { ProjectNumber = "ProjectNumber" } },
                new object[] { new ProjectFilter() { Name = "Name" } },
                new object[] { new ProjectFilter() { StatusId = new[] { 1 } } },
                new object[] { new ProjectFilter() { TierLevelId = 2 } }
            };

        public static IEnumerable<object[]> ProjectQueries =>
            new List<object[]>
            {
                new object[] { new Uri("http://host/api/projects?Agencies=1,2") },
                new object[] { new Uri("http://host/api/projects?ProjectNumber=ProjectNumber") },
                new object[] { new Uri("http://host/api/projects?Name=Name") },
                new object[] { new Uri("http://host/api/projects?StatusId=1") },
                new object[] { new Uri("http://host/api/projects?TierLevelId=1") }
            };

        public static IEnumerable<object[]> WorkflowCodes =>
            new List<object[]>
            {
                new object[] { "", "" },
                new object[] { null, "" },
                new object[] { null, null },
                new object[] { "", null },
                new object[] { " ", "" },
                new object[] { " ", " " },
                new object[] { "", " " },
                new object[] { "code", "" },
                new object[] { "code", " " },
                new object[] { "code", null },
                new object[] { "", "code" },
                new object[] { " ", "code" },
                new object[] { null, "code" }
            };

        public static IEnumerable<object[]> WorkflowIds =>
            new List<object[]>
            {
                new object[] { "", 1 },
                new object[] { " ", 1 },
                new object[] { null, 1 }
            };
        #endregion

        #region Constructors
        public DisposeControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetProject
        [Fact]
        public void GetProject_ByNumber_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1, 1);
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);

            // Act
            var result = controller.GetProject(project.ProjectNumber);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectModel>(project), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Project.Get(project.ProjectNumber), Times.Once());
        }

        [Fact]
        public void GetProject_ById_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1, 1);
            service.Setup(m => m.Project.Get(It.IsAny<int>())).Returns(project);

            // Act
            var result = controller.GetProject(project.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.ProjectModel>(project), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Project.Get(project.Id), Times.Once());
        }

        [Fact]
        public void GetProject_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1, 1);
            project.ProjectNumber = "ProjectNumber";
            project.Name = "ProjectName";
            project.Description = "ProjectDescription";
            project.TierLevelId = 1;
            project.StatusId = 1;
            project.AgencyId = 1;

            var parcel = EntityHelper.CreateParcel(1, 1, 1, project.Agency);
            var building = EntityHelper.CreateBuilding(parcel, 1, project.ProjectNumber, "local", 1, 1, project.Agency);
            project.AddProperty(parcel);
            project.AddProperty(building);

            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);

            // Act
            var result = controller.GetProject(project.ProjectNumber);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            Assert.Equal(project.ProjectNumber, actualResult.ProjectNumber);
            Assert.Equal(project.Description, actualResult.Description);
            Assert.Equal(project.Name, actualResult.Name);
            Assert.Equal(project.StatusId, actualResult.StatusId);
            Assert.Equal(project.TierLevelId, actualResult.TierLevelId);
            Assert.Equal(project.AgencyId, actualResult.AgencyId);
            Assert.Equal(project.Properties.Count(), actualResult.Properties.Count());
            actualResult.OfferAmount.Should().Be(JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(project.Metadata).OfferAmount);
        }
        #endregion

        #region AddProject
        [Fact]
        public async void AddProject_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectAdd);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            service.Setup(m => m.Project.AddAsync(It.IsAny<Entity.Project>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);

            // Act
            var result = await controller.AddProjectAsync(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualProject = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            actualProject.OfferAmount.Should().Be(JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(project.Metadata).OfferAmount);
            service.Verify(m => m.Project.AddAsync(It.IsAny<Entity.Project>()), Times.Once());
        }
        #endregion

        #region UpdateProject
        [Fact]
        public async void UpdateProject_SuccessAsync()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectEdit);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            service.Setup(m => m.Project.UpdateAsync(It.IsAny<Entity.Project>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);

            // Act
            var result = await controller.UpdateProjectAsync(project.ProjectNumber, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            actualResult.OfferAmount.Should().Be(JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(project.Metadata).OfferAmount);
            service.Verify(m => m.Project.UpdateAsync(It.IsAny<Entity.Project>()), Times.Once());
        }
        #endregion

        #region DeleteProject
        [Fact]
        public async void DeleteProject_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            service.Setup(m => m.Project.RemoveAsync(It.IsAny<Entity.Project>())).Returns(Task.FromResult<Entity.Project>(project));
            var modelToDelete = mapper.Map<Model.ProjectModel>(project);

            // Act
            var result = await controller.DeleteProjectAsync(project.ProjectNumber, modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            actualResult.OfferAmount.Should().Be(JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(project.Metadata).OfferAmount);
            Assert.Equal(mapper.Map<Model.ProjectModel>(project), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Project.RemoveAsync(It.IsAny<Entity.Project>()), Times.Once());
        }
        #endregion

        #region SetStatus
        [Fact]
        public async void SetStatus_WithId_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            var workflow = EntityHelper.CreateWorkflow(1, "test", "TEST", new[] { project.Status });
            service.Setup(m => m.Workflow.Get(It.IsAny<string>())).Returns(workflow);
            service.Setup(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), It.IsAny<Entity.Workflow>())).ReturnsAsync(project);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(project.Status);
            var model = mapper.Map<Model.ProjectModel>(project);

            // Act
            var result = await controller.SetStatusAsync(workflow.Code, project.StatusId, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ProjectModel>(project), actualResult, new DeepPropertyCompare());
            actualResult.WorkflowId.Should().Be(1);
            actualResult.StatusId.Should().Be(1);
            actualResult.OfferAmount.Should().Be(JsonSerializer.Deserialize<Entity.Models.DisposalProjectMetadata>(project.Metadata).OfferAmount);
            service.Verify(m => m.Workflow.Get(workflow.Code), Times.Once());
            service.Verify(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), workflow), Times.Once());
        }

        [Theory]
        [MemberData(nameof(WorkflowIds))]
        public async void SetStatus_WithId_ArgumentException(string workflowCode, int statusId)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            service.Setup(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), It.IsAny<string>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentException>(() => controller.SetStatusAsync(workflowCode, statusId, model));
        }

        [Fact]
        public async void SetStatus_InvalidStatus_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            var workflow = EntityHelper.CreateWorkflow(1, "DRAFT", "code");
            var status = EntityHelper.CreateProjectStatus("DRAFT", "code");
            workflow.Status.Add(new Entity.WorkflowProjectStatus(workflow, status));
            service.Setup(m => m.Workflow.Get(It.IsAny<string>())).Returns(workflow);
            service.Setup(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), It.IsAny<string>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);
            var workflowCode = "code";
            var statusCode = "test";

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => controller.SetStatusAsync(workflowCode, statusCode, model));
        }

        [Fact]
        public async void SetStatus_WithCode_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            var workflow = EntityHelper.CreateWorkflow(1, "DRAFT", "code");
            var status = EntityHelper.CreateProjectStatus("DRAFT", "code");
            workflow.Status.Add(new Entity.WorkflowProjectStatus(workflow, status));
            service.Setup(m => m.Workflow.Get(It.IsAny<string>())).Returns(workflow);
            service.Setup(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), It.IsAny<Entity.Workflow>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);
            var workflowCode = "code";
            var statusCode = "code";

            // Act
            var result = await controller.SetStatusAsync(workflowCode, statusCode, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ProjectModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ProjectModel>(project), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), workflow), Times.Once());
        }

        [Theory]
        [MemberData(nameof(WorkflowCodes))]
        public async void SetStatus_WithCode_ArgumentException(string workflowCode, string statusCode)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<DisposeController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var project = EntityHelper.CreateProject(1);
            service.Setup(m => m.Project.SetStatusAsync(It.IsAny<Entity.Project>(), It.IsAny<string>())).ReturnsAsync(project);
            var model = mapper.Map<Model.ProjectModel>(project);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentException>(() => controller.SetStatusAsync(workflowCode, statusCode, model));
        }
        #endregion
        #endregion
    }
}
