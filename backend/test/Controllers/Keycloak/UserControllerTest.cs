using Xunit;
using System;
using Pims.Api.Test.Helpers;
using Pims.Api.Areas.Keycloak.Controllers;
using Moq;
using Model = Pims.Api.Areas.Keycloak.Models;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using AutoMapper;
using Pims.Dal.Keycloak;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace PimsApi.Test.Keycloak.Controllers
{
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
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var euser = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.SyncUserAsync(It.IsAny<Guid>())).Returns(Task.FromResult(euser));

            // Act
            var result = await controller.SyncUserAsync(euser.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(euser), data);
            service.Verify(m => m.SyncUserAsync(It.IsAny<Guid>()), Times.Once());
        }
        #endregion

        #region GetUsersAsync
        [Fact]
        public async void GetUsersAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var euser = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            var eusers = new[] { euser };
            service.Setup(m => m.GetUsersAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>())).Returns(Task.FromResult((IEnumerable<Entity.User>)eusers));

            // Act
            var result = await controller.GetUsersAsync(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.UserModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel[]>(eusers), data);
            service.Verify(m => m.GetUsersAsync(1, 10, It.IsAny<string>()), Times.Once());
        }
        #endregion

        #region GetUserAsync
        [Fact]
        public async void GetUserAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var euser = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.GetUserAsync(It.IsAny<Guid>())).Returns(Task.FromResult(euser));

            // Act
            var result = await controller.GetUserAsync(euser.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(euser), data);
            service.Verify(m => m.GetUserAsync(It.IsAny<Guid>()), Times.Once());
        }
        #endregion

        #region UpdateUserAsync
        [Fact]
        public async void UpdateUserAsync_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsKeycloakService>>();
            var euser = new Entity.User(Guid.NewGuid(), "test", "test@test.com");
            service.Setup(m => m.UpdateUserAsync(It.IsAny<Entity.User>())).Returns(Task.FromResult(euser));
            var model = new Model.Update.UserModel()
            {
                DisplayName = euser.DisplayName,
                FirstName = euser.FirstName,
                LastName = euser.LastName,
                Email = euser.Email,
                IsDisabled = euser.IsDisabled
            };

            // Act
            var result = await controller.UpdateUserAsync(euser.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(euser), data);
            service.Verify(m => m.UpdateUserAsync(It.IsAny<Entity.User>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
