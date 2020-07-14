using Pims.Api.Areas.Project.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// StatusControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "projects")]
    [Trait("group", "status")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class StatusControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public StatusControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Status_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(StatusController);
            type.HasArea("projects");
            type.HasRoute("[area]/status");
            type.HasRoute("v{version:apiVersion}/[area]/status");
            type.HasApiVersion("1.0");
            type.HasAuthorize();
        }

        [Fact]
        public void GetStatus_Route()
        {
            // Arrange
            var endpoint = typeof(StatusController).FindMethod(nameof(StatusController.GetStatus));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForStatus_Id_Route()
        {
            // Arrange
            var endpoint = typeof(StatusController).FindMethod(nameof(StatusController.GetTasksForStatus), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{statusId:int}/tasks");
            endpoint.HasPermissions(Permissions.ProjectView);
        }

        [Fact]
        public void GetTasksForStatus_Code_Route()
        {
            // Arrange
            var endpoint = typeof(StatusController).FindMethod(nameof(StatusController.GetTasksForStatus), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{statusCode}/tasks");
            endpoint.HasPermissions(Permissions.ProjectView);
        }
        #endregion
    }
}
