using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Keycloak.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Keycloak;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.Role;

namespace PimsApi.Test.Keycloak.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "keycloak")]
    [Trait("group", "role")]
    [ExcludeFromCodeCoverage]
    public class RoleControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public RoleControllerTest()
        {
        }
        #endregion

        #region Tests
        #region SyncRolesAsync
        [Fact]
        public async void SyncRolesAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var erole = new Entity.Role(Guid.NewGuid(), "test");
            var eroles = new[] { erole };
            service.Setup(m => m.SyncRolesAsync()).Returns(Task.FromResult((IEnumerable<Entity.Role>)eroles));

            // Act
            var result = await controller.SyncRolesAsync();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.RoleModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel[]>(eroles), data, new DeepPropertyCompare());
            service.Verify(m => m.SyncRolesAsync(), Times.Once());
        }
        #endregion

        #region GetRolesAsync
        [Fact]
        public async void GetRolesAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var erole = new Entity.Role(Guid.NewGuid(), "test");
            var eroles = new[] { erole };
            service.Setup(m => m.GetRolesAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(Task.FromResult((IEnumerable<Entity.Role>)eroles));

            // Act
            var result = await controller.GetRolesAsync(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.RoleModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel[]>(eroles), data, new DeepPropertyCompare());
            service.Verify(m => m.GetRolesAsync(1, 10, It.IsAny<string>()), Times.Once());
        }
        #endregion

        #region GetRoleAsync
        [Fact]
        public async void GetRoleAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var erole = new Entity.Role(Guid.NewGuid(), "test");
            service.Setup(m => m.GetRoleAsync(It.IsAny<Guid>())).Returns(Task.FromResult(erole));

            // Act
            var result = await controller.GetRoleAsync(erole.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(erole), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.GetRoleAsync(It.IsAny<Guid>()), Times.Once());
        }
        #endregion

        #region UpdateRoleAsync
        [Fact]
        public async void UpdateRoleAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var erole = new Entity.Role(Guid.NewGuid(), "test") { Description = "description" };
            service.Setup(m => m.UpdateRoleAsync(It.IsAny<Entity.Role>())).Returns(Task.FromResult(erole));
            var model = mapper.Map<Model.Update.RoleModel>(erole);

            // Act
            var result = await controller.UpdateRoleAsync(erole.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            var expectedResult = mapper.Map<Model.RoleModel>(erole);
            Assert.Equal(expectedResult.Id, actualResult.Id);
            Assert.Equal(expectedResult.Name, actualResult.Name);
            Assert.Equal(expectedResult.Description, actualResult.Description);
            service.Verify(m => m.UpdateRoleAsync(It.IsAny<Entity.Role>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
