using Pims.Api.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// UserControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
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
            type.HasAuthorize();
            type.HasRoute("users");
            type.HasRoute("v{version:apiVersion}/users");
        }

        [Fact]
        public void UserInfo_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.UserInfoAsync));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("info");
        }

        [Fact]
        public void GetAccessRequest_Current_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetAccessRequest));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("access/requests");
        }

        [Fact]
        public void GetAccessRequest_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.GetAccessRequest), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("access/requests/{id}");
        }

        [Fact]
        public void AddAccessRequest_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.AddAccessRequestAsync), typeof(Model.AccessRequestModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("access/requests");
        }

        [Fact]
        public void UpdateAccessRequest_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.UpdateAccessRequest), typeof(int), typeof(Model.AccessRequestModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("access/requests/{id}");
        }
        #endregion
    }
}
