using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// DisposeControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "projects")]
    [Trait("group", "project")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class DisposeControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public DisposeControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Dispose_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(DisposeController);
            type.HasArea("projects");
            type.HasRoute("[area]/disposal");
            type.HasRoute("v{version:apiVersion}/[area]/disposal");
            type.HasApiVersion("1.0");
            type.HasAuthorize();
        }

        [Fact]
        public void GetProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.GetProject), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{projectNumber}");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void AddProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.AddProjectAsync), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
            endpoint.HasPermissions(Permissions.ProjectAdd);
        }

        [Fact]
        public void UpdateProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.UpdateProjectAsync), typeof(string), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{projectNumber}");
            endpoint.HasPermissions(Permissions.ProjectEdit);
        }

        [Fact]
        public void DeleteProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.DeleteProjectAsync), typeof(string), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{projectNumber}");
            endpoint.HasPermissions(Permissions.ProjectDelete);
        }

        [Fact]
        public void SetStatus_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.SetStatusAsync), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("workflows");
            endpoint.HasPermissions(Permissions.ProjectEdit);
        }

        [Fact]
        public void SetStatus_WithStatusId_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.SetStatusAsync), typeof(string), typeof(int), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("workflows/{workflowCode}/{statusId:int}");
            endpoint.HasPermissions(Permissions.ProjectEdit);
        }

        [Fact]
        public void SetStatus_WithStatusCode_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.SetStatusAsync), typeof(string), typeof(string), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("workflows/{workflowCode}/{statusCode}");
            endpoint.HasPermissions(Permissions.ProjectEdit);
        }

        [Fact]
        public void GetProjectNotificationsAsync_AsQuery_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.GetProjectNotificationsAsync), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}/notifications");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetProjectNotificationsAsync_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.GetProjectNotificationsAsync), typeof(Pims.Dal.Entities.Models.ProjectNotificationFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("notifications");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void CancelProjectNotificationsAsync_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.CancelProjectNotificationsAsync), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}/notifications/cancel");
            endpoint.HasPermissions(Permissions.ProjectEdit);
        }
        #endregion
    }
}
