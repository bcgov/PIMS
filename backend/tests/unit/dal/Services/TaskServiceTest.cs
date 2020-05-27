using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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
        public static IEnumerable<object[]> Tasks =>
            new List<object[]>
            {
                new object[] { Entity.TaskTypes.None, 0 },
                new object[] { Entity.TaskTypes.DisposalProjectDocuments, 2 }
            };
        #endregion

        #region Constructors
        public TaskServiceTest() { }
        #endregion

        #region Tests
        #region GetWorkflow
        [Theory]
        [MemberData(nameof(Tasks))]
        public void Get(Entity.TaskTypes type, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            
            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateTasks();
            init.SaveRange(status);

            var service = helper.CreateService<TaskService>(user);

            // Act
            var result = service.Get(type);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Task>>(result);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion
        #endregion
    }
}
