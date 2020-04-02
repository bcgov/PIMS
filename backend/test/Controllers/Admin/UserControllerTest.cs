using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Areas.Admin.Models.User;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using Xunit;
using Pims.Core.Comparers;

namespace PimsApi.Test.Admin.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "user")]
    public class UserControllerTest
    {
        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void GetAccessRequests_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequest2 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(paged);

            // Act
            var result = controller.GetAccessRequests(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>()), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMin_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequest2 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(paged);

            // Act
            var result = controller.GetAccessRequests(-1, -10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(1, 1, null, null), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMax_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequest2 = EntityHelper.CreateAccessRequest(Guid.NewGuid());
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(paged);

            // Act
            var result = controller.GetAccessRequests(2, 100);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(2, 20, null, null), Times.Once());
        }
        #endregion

        #region GetUsers
        [Fact]
        public void GetUsers_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var users = new Entity.User[] { EntityHelper.CreateUser("user1"), EntityHelper.CreateUser("user2") };
            var paged = new Entity.Models.Paged<Entity.User>(users);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(paged);

            // Act
            var result = controller.GetUsers();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Entity.Models.Paged<Model.UserModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel[]>(users), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }
        #endregion

        #region GetUser
        [Fact]
        public void GetUser()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var user = EntityHelper.CreateUser("user1");
            service.Setup(m => m.User.Get(It.IsAny<Guid>())).Returns(user);

            // Act
            var result = controller.GetUser(user.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(user), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.User.Get(user.Id), Times.Once());
        }
        #endregion
        #endregion
    }
}
