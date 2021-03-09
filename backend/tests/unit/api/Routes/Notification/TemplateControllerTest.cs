using Pims.Api.Areas.Notification.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Notification.Models.Template;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// TemplateControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "notifications")]
    [Trait("group", "templates")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class TemplateControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public TemplateControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Template_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(TemplateController);
            type.HasArea("notifications");
            type.HasRoute("[area]/templates");
            type.HasRoute("v{version:apiVersion}/[area]/templates");
            type.HasApiVersion("1.0");
            type.HasAuthorize();
        }

        [Fact]
        public void GetNotificationTemplates_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.GetNotificationTemplates));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void GetNotificationTemplate_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.GetNotificationTemplate), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void AddNotificationTemplate_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.AddNotificationTemplate), typeof(Model.NotificationTemplateModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void UpdateNotificationTemplate_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.UpdateNotificationTemplate), typeof(Model.NotificationTemplateModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void DeleteNotificationTemplate_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.DeleteNotificationTemplate), typeof(Model.NotificationTemplateModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{id}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void SendNotificationAsync_Route()
        {
            // Arrange
            var endpoint = typeof(TemplateController).FindMethod(nameof(TemplateController.SendProjectNotificationAsync), typeof(int), typeof(string), typeof(string), typeof(string), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("{templateId}/projects/{projectId}");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }
        #endregion
    }
}
