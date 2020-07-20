using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Notification.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Notification.Models.Queue;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "notifications")]
    [ExcludeFromCodeCoverage]
    public class QueueControllerTest
    {
        #region Data
        public static IEnumerable<object[]> NotificationFilters = new List<object[]>()
        {
            new object [] { new NotificationQueueFilter() { AgencyId = 1 } },
            new object [] { new NotificationQueueFilter() { Status = Entity.NotificationStatus.Accepted } },
            new object [] { new NotificationQueueFilter() { ProjectId = 1 } },
            new object [] { new NotificationQueueFilter() { ProjectNumber = "test" } },
            new object [] { new NotificationQueueFilter() { To = "test" } },
            new object [] { new NotificationQueueFilter() { Subject = "test" } },
            new object [] { new NotificationQueueFilter() { Body = "test" } },
            new object [] { new NotificationQueueFilter() { Tag = "test" } },
            new object [] { new NotificationQueueFilter() { Key = Guid.NewGuid() } },
            new object [] { new NotificationQueueFilter() { MinSendOn = DateTime.MinValue } },
            new object [] { new NotificationQueueFilter() { MaxSendOn = DateTime.MaxValue } },
            new object [] { new NotificationQueueFilter() { ProjectNumber = "test" } },
        };

        public static IEnumerable<object[]> NotificationQueryFilters = new List<object[]>()
        {
            new object [] { new Uri("http://host/api/notifications/queue?agencyId=1") },
            new object [] { new Uri("http://host/api/notifications/queue?status=1") },
            new object [] { new Uri("http://host/api/notifications/queue?projectId=1") },
            new object [] { new Uri("http://host/api/notifications/queue?to=test") },
            new object [] { new Uri("http://host/api/notifications/queue?subject=test") },
            new object [] { new Uri("http://host/api/notifications/queue?body=test") },
            new object [] { new Uri("http://host/api/notifications/queue?tag=test") },
            new object [] { new Uri("http://host/api/notifications/queue?key=8d1a35b3-6280-4103-93f5-792f8954bef8") },
            new object [] { new Uri("http://host/api/notifications/queue?minSendOn=2020-01-01") },
            new object [] { new Uri("http://host/api/notifications/queue?maxSendOn=2020-01-01") },
            new object [] { new Uri("http://host/api/notifications/queue?maxSendOn=fakedate") },
            new object [] { new Uri("http://host/api/notifications/queue?projectNumber=test") },
        };
        #endregion

        #region Constructors
        public QueueControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetNotificationsPage
        [Theory]
        [MemberData(nameof(NotificationFilters))]
        public void GetNotificationsPage_Success(NotificationQueueFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin);

            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notifications = EntityHelper.CreateNotificationQueues(1, 2, template);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.NotificationQueue>(notifications, filter.Page, filter.Quantity);
            service.Setup(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>())).Returns(page);

            // Act
            var result = controller.GetNotificationsPage(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.NotificationQueueModel>>(actionResult.Value);
            service.Verify(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(NotificationQueryFilters))]
        public void GetNotificationsPage_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin, uri);

            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var notifications = EntityHelper.CreateNotificationQueues(1, 2, template);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.NotificationQueue>(notifications);
            service.Setup(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>())).Returns(page);

            // Act
            var result = controller.GetNotificationsPage();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.NotificationQueueModel>>(actionResult.Value);
            service.Verify(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetNotificationsPage_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin);
            var request = helper.GetService<Mock<HttpRequest>>();
            request.Setup(m => m.QueryString).Returns(new QueryString("?page=0"));

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetNotificationsPage());
            service.Verify(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetNotificationsPage_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<QueueController>(Permissions.SystemAdmin);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetNotificationsPage(null));
            service.Verify(m => m.NotificationQueue.GetPage(It.IsAny<NotificationQueueFilter>()), Times.Never());
        }
        #endregion

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
            notification.ChesMessageId = Guid.NewGuid();
            service.Setup(m => m.NotificationQueue.Get(It.IsAny<int>())).Returns(notification);
            service.Setup(m => m.NotificationQueue.Update(It.IsAny<Entity.NotificationQueue>()));
            var notifyService = helper.GetService<Mock<Pims.Notifications.INotificationService>>();
            notifyService.Setup(m => m.GetStatusAsync(It.IsAny<Guid>())).ReturnsAsync(new Pims.Notifications.Models.StatusResponse() { Status = "Completed" });

            // Act
            var result = await controller.UpdateNotificationStatusAsync(notification.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.NotificationQueueModel>(actionResult.Value);
            Assert.Null(actionResult.StatusCode);
            Assert.Equal(mapper.Map<Model.NotificationQueueModel>(notification), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.NotificationQueue.Get(notification.Id), Times.Once());
            service.Verify(m => m.NotificationQueue.Update(notification), Times.Once());
            notifyService.Verify(m => m.GetStatusAsync(It.IsAny<Guid>()), Times.Once());
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
            notification.ChesMessageId = Guid.NewGuid();
            service.Setup(m => m.NotificationQueue.Get(It.IsAny<int>())).Returns(notification);
            service.Setup(m => m.NotificationQueue.Update(It.IsAny<Entity.NotificationQueue>()));
            var notifyService = helper.GetService<Mock<Pims.Notifications.INotificationService>>();
            notifyService.Setup(m => m.GetStatusAsync(It.IsAny<Guid>())).ReturnsAsync(new Pims.Notifications.Models.StatusResponse() { Status = "Completed" });

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
