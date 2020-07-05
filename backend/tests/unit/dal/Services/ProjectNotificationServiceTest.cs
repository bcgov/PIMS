using FluentAssertions;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class ProjectNotificationServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ProjectNotifications =>
            new List<object[]>
            {
                new object[] { "SUBMIT", 6 },
                new object[] { "ASSESS", 2 }
            };
        #endregion

        #region Constructors
        public ProjectNotificationServiceTest() { }
        #endregion

        #region Tests
        #region Get
        [Fact]
        public void Get_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var psn = new Entity.ProjectStatusNotification(template, status.Next(0), status.Next(1), Entity.NotificationDelays.None);
            init.AddAndSaveChanges(psn);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            var result = service.Get(psn.Id);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.ProjectStatusNotification>(result);
            result.TemplateId.Should().Be(1);
            result.FromStatusId.Should().Be(1);
            result.ToStatusId.Should().Be(2);
            result.Priority.Should().Be(template.Priority);
            result.Delay.Should().Be(Entity.NotificationDelays.None);
            result.DelayDays.Should().Be(0);
            result.Template.Name.Should().Be("test");
        }

        [Fact]
        public void Get_FromStatus_Null_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var psn = new Entity.ProjectStatusNotification(template, null, status.Next(1), Entity.NotificationDelays.None);
            init.AddAndSaveChanges(psn);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            var result = service.Get(psn.Id);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.ProjectStatusNotification>(result);
            result.TemplateId.Should().Be(1);
            result.FromStatusId.Should().BeNull();
            result.ToStatusId.Should().Be(2);
            result.Priority.Should().Be(template.Priority);
            result.Delay.Should().Be(Entity.NotificationDelays.None);
            result.DelayDays.Should().Be(0);
            result.Template.Name.Should().Be("test");
        }

        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => service.Get(1));
        }
        #endregion

        #region GetFor
        [Fact]
        public void GetFor_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var psn = new Entity.ProjectStatusNotification(template, status.Next(0), status.Next(1), Entity.NotificationDelays.None);
            init.AddAndSaveChanges(psn);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            var results = service.GetFor(status.Next(0).Id, status.Next(1).Id);

            // Assert
            Assert.NotNull(results);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectStatusNotification>>(results);
            var first = results.First();
            first.TemplateId.Should().Be(1);
            first.FromStatusId.Should().Be(1);
            first.ToStatusId.Should().Be(2);
            first.Priority.Should().Be(template.Priority);
            first.Delay.Should().Be(Entity.NotificationDelays.None);
            first.DelayDays.Should().Be(0);
            first.Template.Name.Should().Be("test");
        }

        [Fact]
        public void GetFor_FromStatus_Null_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var psn = new Entity.ProjectStatusNotification(template, null, status.Next(1), Entity.NotificationDelays.None);
            init.AddAndSaveChanges(psn);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            var results = service.GetFor(null, status.Next(1).Id);

            // Assert
            Assert.NotNull(results);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectStatusNotification>>(results);
            var first = results.First();
            first.TemplateId.Should().Be(1);
            first.FromStatusId.Should().BeNull();
            first.ToStatusId.Should().Be(2);
            first.Priority.Should().Be(template.Priority);
            first.Delay.Should().Be(Entity.NotificationDelays.None);
            first.DelayDays.Should().Be(0);
            first.Template.Name.Should().Be("test");
        }

        [Fact]
        public void GetFor_ToStatus_Null_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var template = EntityHelper.CreateNotificationTemplate(1, "test");
            var psn = new Entity.ProjectStatusNotification(template, status.Next(0), null, Entity.NotificationDelays.None);
            init.AddAndSaveChanges(psn);

            var service = helper.CreateService<ProjectNotificationService>(user);

            // Act
            var results = service.GetFor(status.Next(0).Id, null);

            // Assert
            Assert.NotNull(results);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectStatusNotification>>(results);
            var first = results.First();
            first.TemplateId.Should().Be(1);
            first.FromStatusId.Should().Be(1);
            first.ToStatusId.Should().BeNull();
            first.Priority.Should().Be(template.Priority);
            first.Delay.Should().Be(Entity.NotificationDelays.None);
            first.DelayDays.Should().Be(0);
            first.Template.Name.Should().Be("test");
        }
        #endregion
        #endregion
    }
}
