using Pims.Core.Test;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Models.Building;

namespace PimsApi.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "mapping")]
    [Trait("group", "building")]
    [ExcludeFromCodeCoverage]
    public class BuildingControllerMapTest
    {
        #region Constructors
        public BuildingControllerMapTest()
        {
        }
        #endregion

        #region Tests
        #region UserInfo
        [Fact]
        public void BuildingModelMapping()
        {
            // Arrange
            var helper = new TestHelper();
            var mapper = helper.GetMapper();
            var parcel = EntityHelper.CreateParcel(99);
            var building = EntityHelper.CreateBuilding(parcel, 99);
            building.Location.Y = 1;
            building.Location.X = 1;

            // Act
            var result = mapper.Map<Model.BuildingModel>(building);

            // Assert
            Assert.Equal(99, result.Id);
            Assert.Equal(99, result.ParcelId);
            Assert.Equal(1, result.Latitude);
            Assert.Equal(1, result.Longitude);
            Assert.Equal("description-99", result.Description);
            Assert.Equal(1, result.ClassificationId);
            Assert.Equal(1, result.AgencyId);
            Assert.Equal(1, result.BuildingConstructionTypeId);
            Assert.Equal(1, result.BuildingOccupantTypeId);
            Assert.Equal(1, result.BuildingPredominateUseId);
            // TODO: test all other properties.
        }
        #endregion
        #endregion
    }
}
