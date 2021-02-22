using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Security;
using Xunit;

namespace Pims.Api.Test.Routes.Admin
{
    /// <summary>
    /// AccessRequestControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "accessRequest")]
    [Trait("group", "route")]
    public class AccessRequestControllerTest
    {
        #region Constructors
        public AccessRequestControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void AccessRequests_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(AccessRequestController);
            type.HasPermissions(Permissions.AdminUsers);
            type.HasArea("admin");
            type.HasRoute("[area]/access/requests");
            type.HasRoute("v{version:apiVersion}/[area]/access/requests");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetPage_Route()
        {
            // Arrange
            var endpoint = typeof(AccessRequestController).FindMethod(nameof(AccessRequestController.GetPage),
                typeof(int), typeof(int), typeof(string), typeof(string),
                typeof(string), typeof(string), typeof(AccessRequestStatus));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
        }

        [Fact]
        public void Delete_Route()
        {
            // Arrange
            var endpoint = typeof(AccessRequestController).FindMethod(nameof(AccessRequestController.Delete), typeof(int), typeof(Pims.Api.Areas.Admin.Models.User.AccessRequestModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{id}");
        }
        #endregion
    }
}
