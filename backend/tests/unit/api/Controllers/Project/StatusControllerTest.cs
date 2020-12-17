using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Project.Models.Status;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class StatusControllerTest
    {
        #region Constructors
        public StatusControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetStatus
        [Fact]
        public void GetStatus_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<StatusController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status = EntityHelper.CreateDefaultProjectStatus();
            service.Setup(m => m.ProjectStatus.Get()).Returns(status);

            // Act
            var result = controller.GetStatus();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectStatusModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            var expectedResult = mapper.Map<Model.ProjectStatusModel[]>(status);
            actualResult.Should().HaveCount(26);
            service.Verify(m => m.ProjectStatus.Get(), Times.Once());
        }
        #endregion

        #region GetTasksForStatus
        [Fact]
        public void GetTasksForStatus_Code_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<StatusController>(Permissions.ProjectView);

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
            var controller = helper.CreateController<StatusController>(Permissions.ProjectView);

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
