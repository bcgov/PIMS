using FluentAssertions;
using Pims.Core.Extensions;
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
    public class NotificationQueueServiceTest
    {
        #region Data
        public static IEnumerable<object[]> NotificationQueueFilters =>
            new List<object[]>
            {
                new object[] { new Entity.Models.NotificationQueueFilter() { To = "1@1" }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { AgencyId = 1 }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { ProjectId = 1 }, 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter() { ProjectNumber = "test" }, 0, 0 },
                new object[] { new Entity.Models.NotificationQueueFilter() { ProjectNumber = "test-pass" }, 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Status = Entity.NotificationStatus.Failed }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Key = new Guid("8d1a35b3-6280-4103-93f5-792f8954bef8") }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Subject = "find" }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Body = "find" }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Tag = "find" }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { MinSendOn = new DateTime(2020, 1, 1) }, 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter() { MaxSendOn = new DateTime(2020, 1, 1) }, 10, 19 },
                new object[] { new Entity.Models.NotificationQueueFilter() { MinSendOn = new DateTime(2020, 1, 1), MaxSendOn = new DateTime(2020, 1, 1) }, 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Status = Entity.NotificationStatus.Pending, Sort = new[] { "UpdatedOn" } }, 10, 19 },
                new object[] { new Entity.Models.NotificationQueueFilter() { Status = Entity.NotificationStatus.Pending, Sort = new[] { "UpdatedOn desc" } }, 10, 19 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("to", "1@1") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("agencyId", "1") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("projectId", "1") })), 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("projectNumber", "test") })), 0, 0 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("projectNumber", "test-pass") })), 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("status", "failed") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("key", "8d1a35b3-6280-4103-93f5-792f8954bef8") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("subject", "find") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("body", "find") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("tag", "find") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("minSendOn", "2020-01-01") })), 2, 2 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("maxSendOn", "2020-01-01") })), 10, 19 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("minSendOn", "2020-01-01"), new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("maxSendOn", "2020-01-01") })), 1, 1 },
                new object[] { new Entity.Models.NotificationQueueFilter(new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(new[] { new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("status", "pending"), new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("sort", "UpdatedOn") })), 10, 19 },
            };
        #endregion

        #region Constructors
        public NotificationQueueServiceTest() { }
        #endregion

        #region Tests
        #region GetPage
        [Theory]
        [MemberData(nameof(NotificationQueueFilters))]
        public void GetQueues_Success(Entity.Models.NotificationQueueFilter filter, int expectedResult, int expectedTotal)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var init = helper.CreatePimsContext(user, true);
            var template = init.CreateNotificationTemplate(1, "test");
            var notifications = init.CreateNotificationQueues(1, 20, template);
            var project = init.CreateProject(1);
            project.ProjectNumber = "test-pass";
            notifications.ForEach(n => n.SendOn = DateTime.MinValue);
            notifications.Next(0).ToAgencyId = 1;
            notifications.Next(1).ProjectId = 1;
            notifications.Next(2).Status = Entity.NotificationStatus.Failed;
            notifications.Next(3).To = "1@1.com";
            notifications.Next(4).Key = new Guid("8d1a35b3-6280-4103-93f5-792f8954bef8");
            notifications.Next(5).Subject = "-find-";
            notifications.Next(6).Body = "-find-";
            notifications.Next(6).Tag = "-find-";
            notifications.Next(7).SendOn = new DateTime(2020, 1, 1);
            notifications.Next(8).SendOn = new DateTime(2020, 1, 2);
            notifications.Next(9).Project = project;
            notifications.Next(10).UpdatedOn = DateTime.UtcNow.AddDays(-1);
            notifications.Next(11).UpdatedOn = DateTime.UtcNow.AddDays(1);
            init.AddAndSaveRange(notifications);

            var service = helper.CreateService<NotificationQueueService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.Models.Paged<Entity.NotificationQueue>>(result);
            result.Should().HaveCount(expectedResult);
            result.Total.Should().Be(expectedTotal);
        }

        [Fact]
        public void GetQueues_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            var service = helper.CreateService<NotificationQueueService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.GetPage(null));
        }

        [Fact]
        public void GetQueues_ArgumentNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            var service = helper.CreateService<NotificationQueueService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.GetPage(null));
        }
        #endregion
        #endregion
    }
}
