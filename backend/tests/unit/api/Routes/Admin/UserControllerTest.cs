using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Test.Routes.Admin
{
    /// <summary>
    /// UserControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "user")]
    [Trait("group", "route")]
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
        [Fact]
        public void User_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(UserController);
            type.HasPermissions(Permissions.AdminUsers);
            type.HasArea("admin");
            type.HasRoute("[area]/users");
            type.HasRoute("v{version:apiVersion}/[area]/users");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetUsers_Query_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetUsers));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
        }

        [Fact]
        public void GetUsers_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetUsers), typeof(UserFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("filter");
        }

        [Fact]
        public void GetMyUsers_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetMyUsers), typeof(UserFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("my/agency");
        }

        [Fact]
        public void AddUser_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.AddUser), typeof(Model.UserModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
        }

        [Fact]
        public void UpdateUser_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.UpdateUser), typeof(Guid), typeof(Model.UserModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
        }

        [Fact]
        public void DeleteUser_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.DeleteUser), typeof(Guid), typeof(Model.UserModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{id}");
        }
        #endregion
    }
}
