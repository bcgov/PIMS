using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Dal;
using Pims.Dal.Security;
using Pims.Core.Test;
using Pims.Core.Comparers;
using Pims.Api.Areas.Notification.Controllers;
using Moq;
using Model = Pims.Api.Areas.Notification.Models.Queue;
using Microsoft.AspNetCore.Mvc;
using MapsterMapper;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "notifications")]
    [ExcludeFromCodeCoverage]
    public class QueueControllerTest
    {
        #region Data
        #endregion

        #region Constructors
        public QueueControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetNotificationQueue
        [Fact]
        public void GetNotificationQueue_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notification = EntityHelper.CreateNotificationQueue(1, template);
            service.Setup(m => m.NotificationQueue.Get(It.IsAny<int>())).Returns(notification);

            // Act
            var result = controller.GetNotificationQueue(notification.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.NotificationQueueModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.NotificationQueueModel>(notification), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.NotificationQueue.Get(notification.Id), Times.Once());
        }

        [Fact]
        public void GetNotificationQueue_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notification = EntityHelper.CreateNotificationQueue(1, template);

            service.Setup(m => m.NotificationQueue.Get(It.IsAny<int>())).Returns(notification);

            // Act
            var result = controller.GetNotificationQueue(notification.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.NotificationQueueModel>(actionResult.Value);
            Assert.Equal(notification.Key, actualResult.Key);
            Assert.Equal(notification.To, actualResult.To);
            Assert.Equal(notification.Cc, actualResult.Cc);
            Assert.Equal(notification.Bcc, actualResult.Bcc);
            Assert.Equal(notification.Status, actualResult.Status);
            Assert.Equal(notification.Encoding, actualResult.Encoding);
            Assert.Equal(notification.BodyType, actualResult.BodyType);
            Assert.Equal(notification.Subject, actualResult.Subject);
            Assert.Equal(notification.Body, actualResult.Body);
            Assert.Equal(notification.Tag, actualResult.Tag);
            Assert.Equal(notification.SendOn, actualResult.SendOn);
            Assert.Equal(notification.ChesMessageId, actualResult.ChesMessageId);
            Assert.Equal(notification.ChesTransactionId, actualResult.ChesTransactionId);
            Assert.Equal(notification.CreatedOn, actualResult.CreatedOn);
            Assert.Equal(notification.UpdatedOn, actualResult.UpdatedOn);
            Assert.Equal(notification.ToAgencyId, actualResult.ToAgencyId);
            Assert.Equal(notification.ProjectId, actualResult.ProjectId);
        }
        #endregion


        #region UpdateNotificationStatusAsync
        [Fact]
        public async void UpdateNotificationStatusAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notification = EntityHelper.CreateNotificationQueue(1, template);
            service.Setup(m => m.NotificationQueue.UpdateStatusAsync(It.IsAny<int>())).ReturnsAsync(notification);

            // Act
            var result = await controller.UpdateNotificationStatusAsync(notification.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.NotificationQueueModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.NotificationQueueModel>(notification), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.NotificationQueue.UpdateStatusAsync(notification.Id), Times.Once());
        }

        [Fact]
        public async void UpdateNotificationStatusAsync_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notification = EntityHelper.CreateNotificationQueue(1, template);

            service.Setup(m => m.NotificationQueue.UpdateStatusAsync(It.IsAny<int>())).ReturnsAsync(notification);

            // Act
            var result = await controller.UpdateNotificationStatusAsync(notification.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.NotificationQueueModel>(actionResult.Value);
            Assert.Equal(notification.Key, actualResult.Key);
            Assert.Equal(notification.To, actualResult.To);
            Assert.Equal(notification.Cc, actualResult.Cc);
            Assert.Equal(notification.Bcc, actualResult.Bcc);
            Assert.Equal(notification.Status, actualResult.Status);
            Assert.Equal(notification.Encoding, actualResult.Encoding);
            Assert.Equal(notification.BodyType, actualResult.BodyType);
            Assert.Equal(notification.Subject, actualResult.Subject);
            Assert.Equal(notification.Body, actualResult.Body);
            Assert.Equal(notification.Tag, actualResult.Tag);
            Assert.Equal(notification.SendOn, actualResult.SendOn);
            Assert.Equal(notification.ChesMessageId, actualResult.ChesMessageId);
            Assert.Equal(notification.ChesTransactionId, actualResult.ChesTransactionId);
            Assert.Equal(notification.CreatedOn, actualResult.CreatedOn);
            Assert.Equal(notification.UpdatedOn, actualResult.UpdatedOn);
            Assert.Equal(notification.ToAgencyId, actualResult.ToAgencyId);
            Assert.Equal(notification.ProjectId, actualResult.ProjectId);
        }
        #endregion
        #endregion
    }
}
