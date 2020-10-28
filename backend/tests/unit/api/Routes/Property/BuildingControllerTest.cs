using Pims.Api.Areas.Property.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// BuildingControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
    [Trait("group", "building")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class BuildingControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public BuildingControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Building_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(BuildingController);
            type.HasAuthorize();
            type.HasArea("properties");
            type.HasRoute("[area]/buildings");
            type.HasRoute("v{version:apiVersion}/[area]/buildings");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetBuilding_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuilding), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.PropertyView);
        }
        #endregion
    }
}
