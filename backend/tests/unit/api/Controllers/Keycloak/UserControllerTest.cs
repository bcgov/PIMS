using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Keycloak.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Keycloak;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Xunit;
using AdminModels = Pims.Api.Areas.Admin.Models.User;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace PimsApi.Test.Keycloak.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "keycloak")]
    [Trait("group", "user")]
    [ExcludeFromCodeCoverage]
    public class UserControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
        #region SyncUserAsync
        [Fact]
        public async void SyncUserAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var user = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.SyncUserAsync(It.IsAny<Guid>())).Returns(Task.FromResult(user));

            // Act
            var result = await controller.SyncUserAsync(user.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var data = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(user), data, new DeepPropertyCompare());
            service.Verify(m => m.SyncUserAsync(It.IsAny<Guid>()), Times.Once());
        }
        #endregion

        #region GetUsersAsync
        [Fact]
        public async void GetUsersAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var user = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            var users = new[] { user };
            service.Setup(m => m.GetUsersAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(Task.FromResult((IEnumerable<Entity.User>)users));

            // Act
            var result = await controller.GetUsersAsync(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var data = Assert.IsType<Model.UserModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel[]>(users), data, new DeepPropertyCompare());
            service.Verify(m => m.GetUsersAsync(1, 10, It.IsAny<string>()), Times.Once());
        }
        #endregion

        #region GetUserAsync
        [Fact]
        public async void GetUserAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var user = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.GetUserAsync(It.IsAny<Guid>())).Returns(Task.FromResult(user));

            // Act
            var result = await controller.GetUserAsync(user.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var data = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(user), data, new DeepPropertyCompare());
            service.Verify(m => m.GetUserAsync(It.IsAny<Guid>()), Times.Once());
        }
        #endregion

        #region UpdateUserAsync
        [Fact]
        public async void UpdateUserAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var user = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.UpdateUserAsync(It.IsAny<Entity.User>())).Returns(Task.FromResult(user));
            var model = mapper.Map<AdminModels.UserModel>(user);

            // Act
            var result = await controller.UpdateUserAsync(user.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<AdminModels.UserModel>(actionResult.Value);
            var expectedResult = mapper.Map<AdminModels.UserModel>(user);
            Assert.Equal(expectedResult.Id, actualResult.Id);
            Assert.Equal(expectedResult.DisplayName, actualResult.DisplayName);
            Assert.Equal(expectedResult.FirstName, actualResult.FirstName);
            Assert.Equal(expectedResult.MiddleName, actualResult.MiddleName);
            Assert.Equal(expectedResult.LastName, actualResult.LastName);
            Assert.Equal(expectedResult.Username, actualResult.Username);
            Assert.Equal(expectedResult.Email, actualResult.Email);
            Assert.Equal(expectedResult.IsDisabled, actualResult.IsDisabled);
            Assert.Equal(expectedResult.EmailVerified, actualResult.EmailVerified);
            Assert.Equal(expectedResult.Position, actualResult.Position);
            Assert.Equal(expectedResult.Note, actualResult.Note);
            Assert.Equal(expectedResult.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(expectedResult.Roles, actualResult.Roles, new DeepPropertyCompare());
            service.Verify(m => m.UpdateUserAsync(It.IsAny<Entity.User>()), Times.Once());
        }
        #endregion

        #region UpdateUserAsync
        [Fact]
        public async void UpdateAccessRequestAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var accessRequest = EntityHelper.CreateAccessRequest();
            service.Setup(m => m.UpdateAccessRequestAsync(It.IsAny<Entity.AccessRequest>())).Returns(Task.FromResult(accessRequest));
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = await controller.UpdateAccessRequestAsync(model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            var expectedResult = mapper.Map<Model.AccessRequestModel>(accessRequest);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.UpdateAccessRequestAsync(It.IsAny<Entity.AccessRequest>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
