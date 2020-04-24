using Pims.Api.Controllers;
using Pims.Core.Test;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// BuildingControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
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
            type.HasRoute("buildings");
            type.HasRoute("v{version:apiVersion}/buildings");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetBuildings_Query_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuildings));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetBuildings_Filter_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuildings), typeof(Dal.Entities.Models.BuildingFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetBuildingL_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuilding), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetBuildingsPage_Query_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuildingsPage));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("page");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetBuildingsPage_Filter_Route()
        {
            // Arrange
            var endpoint = typeof(BuildingController).FindMethod(nameof(BuildingController.GetBuildingsPage), typeof(Dal.Entities.Models.BuildingFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("page/filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }
        #endregion
    }
}
