using Pims.Core.Test;
using Pims.Core.Extensions;
using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Areas.Project.Controllers;
using Model = Pims.Api.Areas.Project.Models.Workflow;
using Pims.Dal.Security;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// WorkflowControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "projects")]
    [Trait("group", "project")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class WorkflowControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public WorkflowControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Workflow_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(WorkflowController);
            type.HasArea("projects");
            type.HasRoute("[area]/workflows");
            type.HasRoute("v{version:apiVersion}/[area]/workflows");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetWorkflow_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetWorkflow), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{workflowCode}");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForWorkflow_Code_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetTasksForWorkflow), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{workflowCode}/tasks");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForStatus_Id_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetTasksForStatus), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("tasks/{statusId:int}");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForStatus_Code_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetTasksForStatus), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("tasks/{statusCode}");
            endpoint.HasPermissions(Permissions.ProjectView);
        }
        #endregion
    }
}
