using FluentAssertions;
using Moq;
using Pims.Core.Test;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class NotificationTemplateServiceTest
    {
        #region Data
        public static IEnumerable<object[]> NotificationTemplates =>
            new List<object[]>
            {
                new object[] { "SUBMIT", 6 },
                new object[] { "ASSESS", 2 }
            };
        #endregion

        #region Constructors
        public NotificationTemplateServiceTest() { }
        #endregion

        #region Tests
        #region GetTemplates
        [Fact]
        public void GetTemplates_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var templates = init.CreateNotificationTemplates(1, 3);
            init.AddAndSaveRange(templates);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            var result = service.Get();

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.NotificationTemplate>>(result);
            result.Should().HaveCount(3);
        }

        [Fact]
        public void GetTemplates_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var init = helper.CreatePimsContext(user, true);
            var templates = init.CreateNotificationTemplates(1, 3);
            init.AddAndSaveRange(templates);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Get());
        }
        #endregion

        #region GetTemplate
        [Fact]
        public void GetTemplate_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var templates = init.CreateNotificationTemplates(1, 3);
            init.AddAndSaveRange(templates);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.NotificationTemplate>(result);
            result.Id.Should().Be(1);
        }

        [Fact]
        public void GetTemplate_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var init = helper.CreatePimsContext(user, true);
            var templates = init.CreateNotificationTemplates(1, 3);
            init.AddAndSaveRange(templates);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Get(1));
        }

        [Fact]
        public void GetTemplate_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");
            init.AddAndSaveChanges(template);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => service.Get(4));
        }
        #endregion

        #region AddTemplate
        [Fact]
        public void AddTemplate_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            var result = service.Add(template);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.NotificationTemplate>(result);
            result.Name.Should().Be("test");
        }

        [Fact]
        public void AddTemplate_ArgumentNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.Add(null));
        }

        [Fact]
        public void AddTemplate_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var template = EntityHelper.CreateNotificationTemplate(1, "test");

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Add(template));
        }
        #endregion

        #region UpdateTemplate
        [Fact]
        public void UpdateTemplate_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");
            init.SaveChanges();

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            template.Subject = "TESTING";
            var result = service.Update(template);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.NotificationTemplate>(result);
            result.Subject.Should().Be("TESTING");
        }

        [Fact]
        public void UpdateTemplate_ArgumentNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.Update(null));
        }

        [Fact]
        public void UpdateTemplate_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var template = EntityHelper.CreateNotificationTemplate(1, "test");

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(template));
        }

        [Fact]
        public void UpdateTemplate_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var template = EntityHelper.CreateNotificationTemplate(1, "test");

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => service.Update(template));
        }
        #endregion

        #region SendNotificationAsync
        [Fact]
        public async void SendNotificationAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");
            init.SaveChanges();

            var service = helper.CreateService<NotificationTemplateService>(user);
            var project = init.CreateProject(1);
            init.SaveChanges();

            var notifyService = helper.GetService<Mock<INotificationService>>();
            var pimsService = helper.GetService<Mock<IPimsService>>();
            notifyService.Setup(m => m.SendAsync(It.IsAny<Entity.NotificationQueue>()));

            // Act
            var result = await service.SendNotificationAsync(template.Id, "test@test.com", project);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.NotificationQueue>(result);
            result.To.Should().Be("test@test.com");
            result.Cc.Should().Be(template.Cc);
            result.Bcc.Should().Be(template.Bcc);
            result.Encoding.Should().Be(template.Encoding);
            result.BodyType.Should().Be(template.BodyType);
            result.Subject.Should().Be(template.Subject);
            result.Body.Should().Be(template.Body);
            result.Tag.Should().Be(template.Tag);
            result.SendOn.Should().BeOnOrBefore(DateTime.UtcNow);
            result.Status.Should().Be(Entity.NotificationStatus.Pending);
        }

        [Fact]
        public async void SendNotificationAsync_Failure()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");
            init.SaveChanges();

            var service = helper.CreateService<NotificationTemplateService>(user);

            var response = new Notifications.Models.EmailResponse()
            {
                Messages = new[] { new Notifications.Models.MessageResponse() { MessageId = Guid.NewGuid() } },
                TransactionId = Guid.NewGuid()
            };
            var project = init.CreateProject(1);
            init.SaveChanges();

            var notifyService = helper.GetService<Mock<INotificationService>>();
            notifyService.Setup(m => m.SendAsync(It.IsAny<Entity.NotificationQueue>())).ThrowsAsync(new Exception());

            // Act
            await Assert.ThrowsAsync<Exception>(async () => await service.SendNotificationAsync(template.Id, "test@test.com", project));

            // Assert
            var result = init.NotificationQueue.Find(template.Id);
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.NotificationQueue>(result);
            result.To.Should().Be("test@test.com");
            result.Cc.Should().Be(template.Cc);
            result.Bcc.Should().Be(template.Bcc);
            result.Encoding.Should().Be(template.Encoding);
            result.BodyType.Should().Be(template.BodyType);
            result.Subject.Should().Be(template.Subject);
            result.Body.Should().Be(template.Body);
            result.Tag.Should().Be(template.Tag);
            result.SendOn.Should().BeOnOrBefore(DateTime.UtcNow);
            result.Status.Should().Be(Entity.NotificationStatus.Failed);
            result.ChesMessageId.Should().BeNull();
            result.ChesTransactionId.Should().BeNull();
        }

        [Fact]
        public async void SendNotificationAsync_ArgumentException_Null()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await service.SendNotificationAsync<object>(1, null, 1));
        }

        [Fact]
        public async void SendNotificationAsync_ArgumentException_Empty()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await service.SendNotificationAsync<object>(1, "", 1));
        }

        [Fact]
        public async void SendNotificationAsync_ArgumentException_Whitespace()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentException>(async () => await service.SendNotificationAsync<object>(1, " ", 1));
        }

        [Fact]
        public async void SendNotificationAsync_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var template = EntityHelper.CreateNotificationTemplate(1, "test");

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SendNotificationAsync<object>(1, "test", 1));
        }

        [Fact]
        public async void SendNotificationAsync_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationTemplateService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await service.SendNotificationAsync<object>(1, "test", 1));
        }
        #endregion
        #endregion
    }
}
