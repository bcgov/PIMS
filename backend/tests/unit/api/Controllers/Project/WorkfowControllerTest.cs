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
            var controller = helper.CreateController<WorkflowController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var status = EntityHelper.CreateProjectStatuses(0, 6);
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
        #endregion
        #endregion
    }
}
