using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace PimsApi.Test.Admin.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "user")]
    [ExcludeFromCodeCoverage]
    public class UserControllerTest
    {
        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
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
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Pims.Api.Models.PageModel<Model.UserModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel[]>(users), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        [Fact]
        public void GetUsers_Filtered_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var users = new Entity.User[] { EntityHelper.CreateUser("user1"), EntityHelper.CreateUser("user2") };
            var paged = new Entity.Models.Paged<Entity.User>(users);
            var filter = new Entity.Models.UserFilter(1, 1, "test", "test",
                "test", "test", "test", "test", false, "test", "test", null);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(paged);

            // Act
            var result = controller.GetUsers(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Pims.Api.Models.PageModel<Model.UserModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel[]>(users), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }
        #endregion

        #region GetMyUsers
        [Fact]
        public void GetMyUsers_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var users = new Entity.User[] { EntityHelper.CreateUser("user1"), EntityHelper.CreateUser("user2") };
            var paged = new Entity.Models.Paged<Entity.User>(users);
            var filter = new Entity.Models.UserFilter(1, 1, "test", "test",
                "test", "test", "test", "test", false, "test", "test", null);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(paged);

            // Act
            var result = controller.GetMyUsers(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Pims.Api.Models.PageModel<Model.UserModel>>(actionResult.Value);
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
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(user), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.User.Get(user.Id), Times.Once());
        }
        #endregion

        #region AddUser
        [Fact]
        public void AddUser()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var user = EntityHelper.CreateUser("user1");
            service.Setup(m => m.User.Add(It.IsAny<Entity.User>())).Callback<Entity.User>(u => u.Agencies.First().Agency = user.Agencies.First().Agency);
            var model = mapper.Map<Model.UserModel>(user);

            // Act
            var result = controller.AddUser(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.UserModel>(actionResult.Value);
            actualResult.CreatedOn.Should().Be(user.CreatedOn);
            actualResult.DisplayName.Should().Be(user.DisplayName);
            actualResult.Email.Should().Be(user.Email);
            actualResult.EmailVerified.Should().Be(user.EmailVerified);
            actualResult.FirstName.Should().Be(user.FirstName);
            actualResult.LastLogin.Should().Be(user.LastLogin);
            actualResult.LastName.Should().Be(user.LastName);
            actualResult.MiddleName.Should().Be(user.MiddleName);
            actualResult.Note.Should().Be(user.Note);
            actualResult.Position.Should().Be(user.Position);
            actualResult.RowVersion.Should().Be(user.RowVersion.ConvertRowVersion());
            actualResult.UpdatedOn.Should().Be(user.UpdatedOn);
            actualResult.Username.Should().Be(user.Username);
            service.Verify(m => m.User.Add(It.IsAny<Entity.User>()), Times.Once());
        }
        #endregion

        #region UpdateUser
        [Fact]
        public void UpdateUser()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var user = EntityHelper.CreateUser("user1");
            service.Setup(m => m.User.Update(It.IsAny<Entity.User>()));
            var model = mapper.Map<Model.UserModel>(user);

            // Act
            var result = controller.UpdateUser(user.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.UserModel>(actionResult.Value);
            actualResult.CreatedOn.Should().Be(user.CreatedOn);
            actualResult.DisplayName.Should().Be(user.DisplayName);
            actualResult.Email.Should().Be(user.Email);
            actualResult.EmailVerified.Should().Be(user.EmailVerified);
            actualResult.FirstName.Should().Be(user.FirstName);
            actualResult.LastLogin.Should().Be(user.LastLogin);
            actualResult.LastName.Should().Be(user.LastName);
            actualResult.MiddleName.Should().Be(user.MiddleName);
            actualResult.Note.Should().Be(user.Note);
            actualResult.Position.Should().Be(user.Position);
            actualResult.RowVersion.Should().Be(user.RowVersion.ConvertRowVersion());
            actualResult.UpdatedOn.Should().Be(user.UpdatedOn);
            actualResult.Username.Should().Be(user.Username);
            service.Verify(m => m.User.Update(It.IsAny<Entity.User>()), Times.Once());
        }
        #endregion

        #region DeleteUser
        [Fact]
        public void DeleteUser()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var user = EntityHelper.CreateUser("user1");
            service.Setup(m => m.User.Remove(It.IsAny<Entity.User>()));
            var model = mapper.Map<Model.UserModel>(user);

            // Act
            var result = controller.DeleteUser(user.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.UserModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.UserModel>(user), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.User.Remove(It.IsAny<Entity.User>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
