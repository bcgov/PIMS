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
    public class WorkflowServiceTest
    {
        #region Data
        public static IEnumerable<object[]> Workflows =>
            new List<object[]>
            {
                new object[] { "SUBMIT", 6 },
                new object[] { "ASSESS", 2 }
            };
        #endregion

        #region Constructors
        public WorkflowServiceTest() { }
        #endregion

        #region Tests
        #region Get
        [Theory]
        [MemberData(nameof(Workflows))]
        public void Get(string code, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);

            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatus(1, 7);
            init.AddAndSaveRange(status);
            var submit = EntityHelper.CreateWorkflow(1, "Submit", "SUBMIT", status);
            var access = EntityHelper.CreateWorkflow(2, "Access", "ASSESS", status.Take(2));
            init.AddAndSaveChanges(submit, access);

            var service = helper.CreateService<WorkflowService>(user);

            // Act
            var result = service.Get(code);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.WorkflowProjectStatus>>(result.Status);
            result.Status.Count().Should().Be(expectedCount);
        }
        #endregion
        #endregion
    }
}
