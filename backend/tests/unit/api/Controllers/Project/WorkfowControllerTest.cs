using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Dal;
using Pims.Dal.Security;
using Pims.Core.Test;
using Pims.Api.Areas.Project.Controllers;
using Moq;
using Model = Pims.Api.Areas.Project.Models.Workflow;
using Microsoft.AspNetCore.Mvc;
using MapsterMapper;
using FluentAssertions;
using Pims.Core.Comparers;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class WorkflowControllerTest
    {
        #region Constructors
        public WorkflowControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetWorkflow
        [Fact]
        public void GetWorkflow_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status = EntityHelper.CreateProjectStatuses(0, 6);
            var workflow = EntityHelper.CreateWorkflow(0, "Submit", "SUBMIT", status);
            service.Setup(m => m.Workflow.Get(It.IsAny<string>())).Returns(workflow);

            // Act
            var result = controller.GetWorkflow("SUBMIT");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectStatusModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            var expectedResult = mapper.Map<Model.ProjectStatusModel[]>(status);
            actualResult.Should().HaveCount(6);
            actualResult.Should().BeEquivalentTo(expectedResult, m => m
                .Excluding(o => o.UpdatedOn)
                .Excluding(o => o.CreatedOn));
            service.Verify(m => m.Workflow.Get("SUBMIT"), Times.Once());
        }
        #endregion

        #region GetTasksForStatus
        [Fact]
        public void GetTasksForStatus_Code_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status0 = EntityHelper.CreateProjectStatus(0, "DRAFT", "DRAFT");
            var tasks = EntityHelper.CreateDefaultTasks(status0);
            service.Setup(m => m.Task.GetForStatus(It.IsAny<string>())).Returns(tasks);

            // Act
            var result = controller.GetTasksForStatus(status0.Code);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.TaskModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.TaskModel[]>(tasks), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Task.GetForStatus(status0.Code), Times.Once());
        }

        [Fact]
        public void GetTasksForStatus_Id_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status0 = EntityHelper.CreateProjectStatus(0, "DRAFT", "DRAFT");
            var tasks = EntityHelper.CreateDefaultTasks(status0);
            service.Setup(m => m.Task.GetForStatus(It.IsAny<int>())).Returns(tasks);

            // Act
            var result = controller.GetTasksForStatus(status0.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.TaskModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.TaskModel[]>(tasks), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Task.GetForStatus(status0.Id), Times.Once());
        }
        #endregion

        #endregion
    }
}
