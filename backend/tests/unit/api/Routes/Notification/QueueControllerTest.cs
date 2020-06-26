using Pims.Core.Test;
using Pims.Core.Extensions;
using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Areas.Notification.Controllers;
using Pims.Dal.Security;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// QueueControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "notifications")]
    [Trait("group", "queue")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class QueueControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public QueueControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Queue_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(QueueController);
            type.HasArea("notifications");
            type.HasRoute("[area]/queue");
            type.HasRoute("v{version:apiVersion}/[area]/queue");
            type.HasApiVersion("1.0");
            type.HasAuthorize();
        }

        [Fact]
        public void GetNotificationQueue_Route()
        {
            // Arrange
            var endpoint = typeof(QueueController).FindMethod(nameof(QueueController.GetNotificationQueue), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void UpdateNotificationStatusAsync_Route()
        {
            // Arrange
            var endpoint = typeof(QueueController).FindMethod(nameof(QueueController.UpdateNotificationStatusAsync), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }
        #endregion
    }
}
