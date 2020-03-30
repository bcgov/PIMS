using Pims.Api.Controllers;
using Pims.Api.Models.Property;
using Pims.Api.Test.Helpers;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// PropertyControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
    [Trait("group", "route")]
    public class PropertyControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public PropertyControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Property_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(PropertyController);
            type.HasAuthorize();
            type.HasRoute("properties");
            type.HasRoute("v{version:apiVersion}/properties");
        }

        #region GetProperties
        [Fact]
        public void GetProperties_Route()
        {
            // Arrange
            var endpoint = typeof(PropertyController).FindMethod(nameof(PropertyController.GetProperties));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetProperties_Post_Route()
        {
            // Arrange
            var endpoint = typeof(PropertyController).FindMethod(nameof(PropertyController.GetProperties), typeof(PropertyFilterModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }
        #endregion
        #endregion
    }
}
