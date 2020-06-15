using Xunit;
using System.Linq;
using System.Collections.Generic;
using Pims.Dal.Services.Admin;
using Pims.Core.Test;
using Pims.Api.Areas.Tools.Controllers;
using Moq;
using Model = Pims.Api.Areas.Tools.Models.Geocoder;
using Microsoft.AspNetCore.Mvc;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Pims.Geocoder;
using Pims.Geocoder.Parameters;
using Pims.Geocoder.Models;
using FluentAssertions;

namespace Pims.Api.Test.Controllers.Tools
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "geocoder")]
    [ExcludeFromCodeCoverage]
    public class GeocoderControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public GeocoderControllerTest() { }
        #endregion

        #region Tests
        #region FindAddressesAsync
        [Fact]
        public async void FindAddressesAsync_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<GeocoderController>(Permissions.PropertyEdit);

            var addresses = new FeatureCollectionModel()
            {
                Features = new []
                {
                    new FeatureModel()
                    {
                        Properties = new PropertyModel()
                        {
                            Score = 1,
                            SiteID = "test",
                            FullAddress = "test",
                            ProvinceCode = "test",
                            CivicNumber = "test",
                            StreetName = "test",
                            LocalityName = "test",
                            LocalityType = "City"
                        },
                        Geometry = new GeometryModel() { Coordinates = new [] { 2d, 1d } }
                    }
                }
            };

            var service = helper.GetService<Mock<IGeocoderService>>();
            service.Setup(m => m.GetSiteAddressesAsync(It.IsAny<AddressesParameters>(), It.IsAny<string>())).ReturnsAsync(addresses);

            // Act
            var result = await controller.FindAddressesAsync("test");

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var results = Assert.IsAssignableFrom<IEnumerable<Model.AddressModel>>(actionResult.Value);
            results.Should().HaveCount(1);
            var first = results.First();
            first.Score.Should().Be(1);
            first.SiteId.Should().Be("test");
            first.FullAddress.Should().Be("test");
            first.ProvinceCode.Should().Be("test");
            first.Address1.Should().Be("test test");
            first.Latitude.Should().Be(1d);
            first.Longitude.Should().Be(2d);
        }

        #endregion
        #endregion
    }
}
