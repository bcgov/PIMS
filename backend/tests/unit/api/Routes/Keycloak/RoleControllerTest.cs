using Pims.Api.Areas.Keycloak.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Routes.Keycloak
{
    /// <summary>
    /// RoleControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "keycloak")]
    [Trait("group", "role")]
    [Trait("group", "route")]
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
        [Fact]
        public void Role_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(RoleController);
            type.HasPermissions(Permissions.AdminRoles);
            type.HasArea("keycloak");
            type.HasRoute("[area]/roles");
            type.HasRoute("v{version:apiVersion}/[area]/roles");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void SyncRolesAsync_Route()
        {
            // Arrange
            var endpoint = typeof(RoleController).FindMethod(nameof(RoleController.SyncRolesAsync));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("sync");
            endpoint.HasPermissions(Permissions.AdminRoles);
        }

        [Fact]
        public void GetRolesAsync_Route()
        {
            // Arrange
            var endpoint = typeof(RoleController).FindMethod(nameof(RoleController.GetRolesAsync), typeof(int), typeof(int), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.AdminRoles);
        }

        [Fact]
        public void GetRoleAsync_Route()
        {
            // Arrange
            var endpoint = typeof(RoleController).FindMethod(nameof(RoleController.GetRoleAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.AdminRoles);
        }

        [Fact]
        public void UpdateRoleAsync_Route()
        {
            // Arrange
            var endpoint = typeof(RoleController).FindMethod(nameof(RoleController.UpdateRoleAsync), typeof(Guid), typeof(Areas.Keycloak.Models.Role.Update.RoleModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
            endpoint.HasPermissions(Permissions.AdminRoles);
        }
        #endregion
    }
}
