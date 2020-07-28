using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Role;

namespace PimsApi.Test.Admin.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "role")]
    [ExcludeFromCodeCoverage]
    public class RoleControllerTest
    {
        #region Constructors
        public RoleControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetRoles
        [Fact]
        public void GetRoles_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var roles = new Entity.Role[] { EntityHelper.CreateRole("role1"), EntityHelper.CreateRole("role2") };
            var paged = new Entity.Models.Paged<Entity.Role>(roles);
            service.Setup(m => m.Role.Get(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(paged);

            // Act
            var result = controller.GetRoles(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Pims.Api.Models.PageModel<Model.RoleModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel[]>(roles), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Role.Get(1, 10, null), Times.Once());
        }

        [Fact]
        public void GetRoles_Filtered_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var roles = new Entity.Role[] { EntityHelper.CreateRole("role1"), EntityHelper.CreateRole("role2") };
            var paged = new Entity.Models.Paged<Entity.Role>(roles);
            service.Setup(m => m.Role.Get(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(paged);

            // Act
            var result = controller.GetRoles(1, 10, "test");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Pims.Api.Models.PageModel<Model.RoleModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel[]>(roles), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Role.Get(1, 10, "test"), Times.Once());
        }
        #endregion

        #region GetRole
        [Fact]
        public void GetRole()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var role = EntityHelper.CreateRole("role1");
            service.Setup(m => m.Role.Get(It.IsAny<Guid>())).Returns(role);

            // Act
            var result = controller.GetRole(role.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(role), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Role.Get(role.Id), Times.Once());
        }
        #endregion

        #region AddRole
        [Fact]
        public void AddRole()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var role = EntityHelper.CreateRole("role1");
            service.Setup(m => m.Role.Add(It.IsAny<Entity.Role>()));
            var model = mapper.Map<Model.RoleModel>(role);

            // Act
            var result = controller.AddRole(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(role), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Role.Add(It.IsAny<Entity.Role>()), Times.Once());
        }
        #endregion

        #region UpdateRole
        [Fact]
        public void UpdateRole()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var role = EntityHelper.CreateRole("role1");
            service.Setup(m => m.Role.Update(It.IsAny<Entity.Role>()));
            var model = mapper.Map<Model.RoleModel>(role);

            // Act
            var result = controller.UpdateRole(role.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(role), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Role.Update(It.IsAny<Entity.Role>()), Times.Once());
        }
        #endregion

        #region DeleteRole
        [Fact]
        public void DeleteRole()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<RoleController>(Permissions.AdminRoles);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var role = EntityHelper.CreateRole("role1");
            service.Setup(m => m.Role.Remove(It.IsAny<Entity.Role>()));
            var model = mapper.Map<Model.RoleModel>(role);

            // Act
            var result = controller.DeleteRole(role.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.RoleModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(role), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Role.Remove(It.IsAny<Entity.Role>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
