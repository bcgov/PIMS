using FluentAssertions;
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
    public class ProjectStatusServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ProjectStatus =>
            new List<object[]>
            {
                new object[] { "SUBMIT", 6 },
                new object[] { "ASSESS", 2 }
            };
        #endregion

        #region Constructors
        public ProjectStatusServiceTest() { }
        #endregion

        #region Tests
        #region Get All
        [Fact]
        public void Get_All()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var workflows = EntityHelper.CreateDefaultWorkflowsWithStatus();
            init.AddAndSaveRange(workflows);

            var service = helper.CreateService<ProjectStatusService>(user);

            // Act
            var result = service.Get();

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectStatus>>(result);
            result.Count().Should().Be(25);
        }
        #endregion

        #region Get One
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            init.CreateProjectStatus(1, "Draft", "DR");
            init.SaveChanges();

            var service = helper.CreateService<ProjectStatusService>(user);

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.ProjectStatus>(result);
            result.Code.Should().Be("DR");
        }

        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var service = helper.CreateService<ProjectStatusService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => service.Get(1));
        }
        #endregion
        #endregion
    }
}
