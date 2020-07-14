using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Project.Models.Workflow;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class WorkflowControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> BadWorkflow = new List<object[]>(
        new[] {
            new object[] { null },
            new object[] { "" },
            new object[] { " " }
        });
        #endregion

        #region Constructors
        public WorkflowControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetWorkflowStatus
        [Fact]
        public void GetWorkflowStatus_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status = EntityHelper.CreateProjectStatus(0, 6);
            var workflow = EntityHelper.CreateWorkflow(0, "Submit", "SUBMIT", status);
            service.Setup(m => m.Workflow.Get(It.IsAny<string>())).Returns(workflow);

            // Act
            var result = controller.GetWorkflowStatus("SUBMIT");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.ProjectStatusModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            var expectedResult = mapper.Map<Model.ProjectStatusModel[]>(workflow.Status);
            actualResult.Should().HaveCount(6);
            actualResult.Should().BeEquivalentTo(expectedResult, m => m
                .Excluding(o => o.UpdatedOn)
                .Excluding(o => o.CreatedOn));
            service.Verify(m => m.Workflow.Get("SUBMIT"), Times.Once());
        }

        [Theory]
        [MemberData(nameof(BadWorkflow))]
        public void GetWorkflowStatus_ArgumentException(string workflowCode)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<ArgumentException>(() => controller.GetWorkflowStatus(workflowCode));
        }
        #endregion

        #region GetWorkflowTasks
        [Fact]
        public void GetWorkflowTasks_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<WorkflowController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status = EntityHelper.CreateProjectStatus(0, 6);
            var workflow = EntityHelper.CreateWorkflow(0, "Submit", "SUBMIT", status);
            var tasks = new[]
            {
                EntityHelper.CreateTask("task 1", status.Next(0)),
                EntityHelper.CreateTask("task 2", status.Next(2))
            };
            service.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(tasks);

            // Act
            var result = controller.GetWorkflowTasks("SUBMIT");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.TaskModel[]>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            actualResult.Should().HaveCount(2);
            service.Verify(m => m.Task.GetForWorkflow("SUBMIT"), Times.Once());
        }
        #endregion
        #endregion
    }
}
