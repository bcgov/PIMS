using Pims.Api.Areas.Tools.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Ches.Models;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// ChesControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "ches")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class ChesControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ChesControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Ches_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(ChesController);
            type.HasAuthorize();
            type.HasArea("tools");
            type.HasRoute("[area]/ches");
            type.HasRoute("v{version:apiVersion}/[area]/ches");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetStatusAsync_Route()
        {
            // Arrange
            var endpoint = typeof(ChesController).FindMethod(nameof(ChesController.GetStatusAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("status/{messageId}");
            endpoint.HasPermissions(Permissions.AdminProjects);
        }

        [Fact]
        public void GetStatusAsync_Post_Route()
        {
            // Arrange
            var endpoint = typeof(ChesController).FindMethod(nameof(ChesController.GetStatusAsync), typeof(Model.StatusModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("status");
            endpoint.HasPermissions(Permissions.AdminProjects);
        }

        [Fact]
        public void CancelEmailAsync_Route()
        {
            // Arrange
            var endpoint = typeof(ChesController).FindMethod(nameof(ChesController.CancelEmailAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("cancel/{messageId}");
            endpoint.HasPermissions(Permissions.AdminProjects);
        }

        [Fact]
        public void CancelEmailAsync_Post_Route()
        {
            // Arrange
            var endpoint = typeof(ChesController).FindMethod(nameof(ChesController.CancelEmailAsync), typeof(Model.StatusModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("cancel");
            endpoint.HasPermissions(Permissions.AdminProjects);
        }
        #endregion
    }
}
