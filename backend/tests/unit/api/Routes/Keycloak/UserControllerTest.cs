using Model = Pims.Api.Areas.Keycloak.Models.User;
using Pims.Api.Areas.Keycloak.Controllers;
using AdminModels = Pims.Api.Areas.Admin.Models.User;
using Pims.Core.Test;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;
using System;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Test.Routes.Keycloak
{
    /// <summary>
    /// UserControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "keycloak")]
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
            type.HasArea("keycloak");
            type.HasRoute("[area]/users");
            type.HasRoute("v{version:apiVersion}/[area]/users");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void SyncUserAsync_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.SyncUserAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("sync/{id}");
            endpoint.HasPermissions(Permissions.AdminUsers);
        }

        [Fact]
        public void GetUsersAsync_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetUsersAsync), typeof(int), typeof(int), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.AdminUsers);
        }

        [Fact]
        public void GetUserAsync_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetUserAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.AdminUsers);
        }

        [Fact]
        public void UpdateUserAsync_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.UpdateUserAsync), typeof(Guid), typeof(AdminModels.UserModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
            endpoint.HasPermissions(Permissions.AdminUsers);
        }

        [Fact]
        public void UpdateAccessRequestAsync_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.UpdateAccessRequestAsync), typeof(Model.AccessRequestModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("access/request");
            endpoint.HasPermissions(Permissions.AdminUsers);
        }
        #endregion
    }
}
