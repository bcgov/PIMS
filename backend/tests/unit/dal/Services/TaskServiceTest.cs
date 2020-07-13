using FluentAssertions;
using Pims.Core.Test;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "task")]
    [ExcludeFromCodeCoverage]
    public class TaskServiceTest
    {
        #region Data
        public static IEnumerable<object[]> TasksWithId =>
            new List<object[]>
            {
                new object[] { 0, 0 },
                new object[] { 1, 2 }
            };

        public static IEnumerable<object[]> TasksWithCode =>
            new List<object[]>
            {
                new object[] { "DRAFT", 0 },
                new object[] { "SUBMIT", 2 }
            };
        #endregion

        #region Constructors
        public TaskServiceTest() { }
        #endregion

        #region Tests
        #region GetWorkflow
        [Theory]
        [MemberData(nameof(TasksWithId))]
        public void Get_WithId(int statusId, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var init = helper.CreatePimsContext(user, true);
            var status1 = EntityHelper.CreateProjectStatus(1, "DRAFT", "DRAFT");
            var status2 = EntityHelper.CreateProjectStatus(2, "SUBMIT", "SUBMIT");
            init.AddAndSaveChanges(status1, status2);
            var tasks = EntityHelper.CreateDefaultTasks(status1);
            init.AddAndSaveRange(tasks);

            var service = helper.CreateService<TaskService>(user);

            // Act
            var result = service.GetForStatus(statusId);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Task>>(result);
            result.Should().HaveCount(expectedCount);
        }

        [Theory]
        [MemberData(nameof(TasksWithCode))]
        public void Get_WithCode(string statusCode, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var init = helper.CreatePimsContext(user, true);
            var status1 = EntityHelper.CreateProjectStatus(1, "DRAFT", "DRAFT");
            var status2 = EntityHelper.CreateProjectStatus(2, "SUBMIT", "SUBMIT");
            init.AddAndSaveChanges(status1, status2);
            var tasks = EntityHelper.CreateDefaultTasks();
            init.AddAndSaveRange(tasks);
            tasks.ForEach(t => status2.Tasks.Add(t));
            init.UpdateAndSaveChanges(status2);

            var service = helper.CreateService<TaskService>(user);

            // Act
            var result = service.GetForStatus(statusCode);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Task>>(result);
            result.Should().HaveCount(expectedCount);
        }
        #endregion
        #endregion
    }
}
