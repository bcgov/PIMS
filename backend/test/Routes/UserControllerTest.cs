using Pims.Api.Controllers;
using Model = Pims.Api.Models.User;
using Pims.Api.Test.Helpers;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// UserControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "user")]
    [Trait("group", "route")]
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
        public void AddAccessRequest_Route()
        {
            // Arrange
            var endpoint = typeof(UserController).FindMethod(nameof(UserController.AddAccessRequest), typeof(Model.AccessRequestModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("access/request");
        }
        #endregion
    }
}
