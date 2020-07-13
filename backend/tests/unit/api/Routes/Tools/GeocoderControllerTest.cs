using Pims.Api.Areas.Tools.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// GeocoderControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "geocoder")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class GeocoderControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public GeocoderControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Geocoder_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(GeocoderController);
            type.HasAuthorize();
            type.HasArea("tools");
            type.HasRoute("[area]/geocoder");
            type.HasRoute("v{version:apiVersion}/[area]/geocoder");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void FindAddressesAsync_Route()
        {
            // Arrange
            var endpoint = typeof(GeocoderController).FindMethod(nameof(GeocoderController.FindAddressesAsync), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("addresses");
            endpoint.HasPermissions(Permissions.PropertyEdit);
        }

        [Fact]
        public void FindPidsAsync_Route()
        {
            // Arrange
            var endpoint = typeof(GeocoderController).FindMethod(nameof(GeocoderController.FindPidsAsync), typeof(Guid));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("parcels/pids/{siteId}");
            endpoint.HasPermissions(Permissions.PropertyEdit);
        }
        #endregion
    }
}
