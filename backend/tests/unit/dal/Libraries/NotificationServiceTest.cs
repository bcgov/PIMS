using FluentAssertions;
using Moq;
using Pims.Ches;
using Pims.Ches.Models;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Notifications;
using Pims.Notifications.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;

namespace Pims.Dal.Test.Libraries
{
    [Trait("category", "unit")]
    [Trait("category", "notification")]
    [Trait("group", "notification")]
    [ExcludeFromCodeCoverage]
    public class NotificationServiceTest
    {
        #region Data
        public static IEnumerable<object[]> BadBuild = new List<object[]>(
            new[] {
                new object[] { null, new EmailTemplate(), typeof(ArgumentException) },
                new object[] { "", new EmailTemplate(), typeof(ArgumentException) },
                new object[] { " ", new EmailTemplate(), typeof(ArgumentException) },
                new object[] { "key", null, typeof(ArgumentNullException) }
            });

        public static IEnumerable<object[]> BadSendNotification = new List<object[]>(
            new[] {
                new object[] { null, new Email(), typeof(ArgumentException) },
                new object[] { "", new Email(), typeof(ArgumentException) },
                new object[] { " ", new Email(), typeof(ArgumentException) },
                new object[] { "key", null, typeof(ArgumentNullException) }
            });
        #endregion

        #region Tests
        #region GetTokenAsync
        [Fact]
        public void GetTokenAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var template = new EmailTemplate()
            {
                Subject = "Test @Model.Id",
                Body = "Test @Model.Id"
            };
            var model = new { Id = 1 };

            // Act
            service.Build("key", template, model);

            // Assert
            template.Subject.Should().Be("Test 1");
            template.Body.Should().Be("Test 1");
        }

        [Theory]
        [MemberData(nameof(BadBuild))]
        public void GetTokenAsync_ArgumentException(string key, IEmailTemplate template, Type exceptionType)
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();
            var model = new { };

            // Act
            // Assert
            Assert.Throws(exceptionType, () => service.Build(key, template, model));
        }
        #endregion

        #region SendNotificationAsync
        [Fact]
        public async void SendNotificationAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var email = new Email()
            {
                From = "from",
                To = new[] { "To" },
                Cc = new[] { "Cc" },
                Bcc = new[] { "Bcc" },
                Encoding = Notifications.Models.EmailEncodings.Utf8,
                Priority = Notifications.Models.EmailPriorities.High,
                BodyType = Notifications.Models.EmailBodyTypes.Html,
                Subject = "Test @Model.Id",
                Body = "Test @Model.Id",
                Tag = "tag",
                SendOn = DateTime.UtcNow
            };
            var model = new { Id = 1 };

            var ches = helper.GetService<Mock<IChesService>>();
            ches.Setup(m => m.SendEmailAsync(It.IsAny<Ches.Models.IEmail>())).ReturnsAsync(new EmailResponseModel());

            // Act
            var result = await service.SendNotificationAsync("key", email, model);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponse>(result);
            ches.Verify(m => m.SendEmailAsync(It.Is<Ches.Models.IEmail>(a =>
                a.From == email.From
                && a.To == email.To
                && a.Cc == email.Cc
                && a.Bcc == email.Bcc
                && a.Encoding == email.Encoding.ConvertTo<Notifications.Models.EmailEncodings, Ches.Models.EmailEncodings>()
                && a.Priority == email.Priority.ConvertTo<Notifications.Models.EmailPriorities, Ches.Models.EmailPriorities>()
                && a.BodyType == email.BodyType.ConvertTo<Notifications.Models.EmailBodyTypes, Ches.Models.EmailBodyTypes>()
                && a.Subject == email.Subject
                && a.Body == email.Body
                && a.Tag == email.Tag
                && a.SendOn == email.SendOn)), Times.Once());
        }

        [Theory]
        [MemberData(nameof(BadSendNotification))]
        public async void SendNotificationAsync_ArgumentException(string key, Notifications.Models.IEmail email, Type exceptionType)
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var model = new { };

            // Act
            // Assert
            await Assert.ThrowsAsync(exceptionType, async () => await service.SendNotificationAsync(key, email, model));
        }

        [Fact]
        public async void SendNotificationAsync_Simple_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var email = new Email()
            {
                From = "from",
                To = new[] { "To" },
                Cc = new[] { "Cc" },
                Bcc = new[] { "Bcc" },
                Encoding = Notifications.Models.EmailEncodings.Utf8,
                Priority = Notifications.Models.EmailPriorities.High,
                BodyType = Notifications.Models.EmailBodyTypes.Html,
                Subject = "Test @Model.Id",
                Body = "Test @Model.Id",
                Tag = "tag",
                SendOn = DateTime.UtcNow
            };
            var model = new { Id = 1 };

            var ches = helper.GetService<Mock<IChesService>>();
            ches.Setup(m => m.SendEmailAsync(It.IsAny<Ches.Models.IEmail>())).ReturnsAsync(new EmailResponseModel());

            // Act
            var result = await service.SendNotificationAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponse>(result);
            ches.Verify(m => m.SendEmailAsync(It.Is<Ches.Models.IEmail>(a =>
                a.From == email.From
                && a.To == email.To
                && a.Cc == email.Cc
                && a.Bcc == email.Bcc
                && a.Encoding == email.Encoding.ConvertTo<Notifications.Models.EmailEncodings, Ches.Models.EmailEncodings>()
                && a.Priority == email.Priority.ConvertTo<Notifications.Models.EmailPriorities, Ches.Models.EmailPriorities>()
                && a.BodyType == email.BodyType.ConvertTo<Notifications.Models.EmailBodyTypes, Ches.Models.EmailBodyTypes>()
                && a.Subject == email.Subject
                && a.Body == email.Body
                && a.Tag == email.Tag
                && a.SendOn == email.SendOn)), Times.Once());
        }

        [Fact]
        public async void SendNotificationAsync_Simple_ArgumentException()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.SendNotificationAsync(null));
        }
        #endregion

        #region SendNotificationsAsync
        [Fact]
        public async void SendNotificationsAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var email = new Email()
            {
                From = "from",
                To = new[] { "To" },
                Cc = new[] { "Cc" },
                Bcc = new[] { "Bcc" },
                Encoding = Notifications.Models.EmailEncodings.Utf8,
                Priority = Notifications.Models.EmailPriorities.High,
                BodyType = Notifications.Models.EmailBodyTypes.Html,
                Subject = "Test @Model.Id",
                Body = "Test @Model.Id",
                Tag = "tag",
                SendOn = DateTime.UtcNow
            };
            var emails = new[] { email };
            var model = new { Id = 1 };

            var ches = helper.GetService<Mock<IChesService>>();
            ches.Setup(m => m.SendEmailAsync(It.IsAny<Ches.Models.IEmailMerge>())).ReturnsAsync(new EmailResponseModel());

            // Act
            var result = await service.SendNotificationsAsync(emails);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<EmailResponse>(result);
            ches.Verify(m => m.SendEmailAsync(It.Is<Ches.Models.IEmailMerge>(a =>
                a.From == email.From
                && a.Encoding == email.Encoding.ConvertTo<Notifications.Models.EmailEncodings, Ches.Models.EmailEncodings>()
                && a.Priority == email.Priority.ConvertTo<Notifications.Models.EmailPriorities, Ches.Models.EmailPriorities>()
                && a.BodyType == email.BodyType.ConvertTo<Notifications.Models.EmailBodyTypes, Ches.Models.EmailBodyTypes>()
                && a.Subject == "{{ subject }}"
                && a.Body == "{{ body }}"
                && a.Contexts.First().To == email.To
                && a.Contexts.First().Cc == email.Cc
                && a.Contexts.First().Bcc == email.Bcc
                && a.Contexts.First().Context != null
                && a.Contexts.First().Context.GetType().IsAnonymousType()
                && a.Contexts.First().Tag == email.Tag
                && a.Contexts.First().SendOn == email.SendOn)), Times.Once());
        }

        [Fact]
        public async void SendNotificationsAsync_Multiple_ArgumentException()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.SendNotificationsAsync(null));
        }
        #endregion

        #region GetStatusAsync
        [Fact]
        public async void GetStatusAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var messageId = Guid.NewGuid();

            var ches = helper.GetService<Mock<IChesService>>();
            ches.Setup(m => m.GetStatusAsync(It.IsAny<Guid>())).ReturnsAsync(new StatusResponseModel());

            // Act
            var result = await service.GetStatusAsync(messageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<StatusResponse>(result);
            ches.Verify(m => m.GetStatusAsync(messageId), Times.Once());
        }
        #endregion

        #region CancelNotificationAsync
        [Fact]
        public async void CancelNotificationAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var service = helper.Create<NotificationService>();

            var messageId = Guid.NewGuid();

            var ches = helper.GetService<Mock<IChesService>>();
            ches.Setup(m => m.CancelEmailAsync(It.IsAny<Guid>())).ReturnsAsync(new StatusResponseModel());

            // Act
            var result = await service.CancelNotificationAsync(messageId);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<StatusResponse>(result);
            ches.Verify(m => m.CancelEmailAsync(messageId), Times.Once());
        }
        #endregion
        #endregion
    }
}
