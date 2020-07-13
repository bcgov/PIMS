using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;

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
            type.HasAuthorize();
        }

        [Fact]
        public void GetWorkflow_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetWorkflowStatus), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{workflowCode}/status");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForWorkflow_Code_Route()
        {
            // Arrange
            var endpoint = typeof(WorkflowController).FindMethod(nameof(WorkflowController.GetWorkflowTasks), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{workflowCode}/tasks");
            endpoint.HasPermissions(Permissions.ProjectView);
        }
        #endregion
    }
}
