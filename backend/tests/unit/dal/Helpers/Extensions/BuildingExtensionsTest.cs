using Xunit;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Dal.Test.Helpers.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("category", "extensions")]
    [Trait("group", "building")]
    [ExcludeFromCodeCoverage]
    public class BuildingExtensionsTest
    {
        #region Tests
        [Fact]
        public void Get_BuildingZoning()
        {
            // Arrange
            var zone = "Zoning";
            var parcel = new Parcel
            {
                Zoning = zone
            };
            var building = new Building
            {
                Parcel = parcel
            };

            // Act
            var zoning = building.GetZoning();

            // Assert
            Assert.Equal(zoning, zone);
        }

        [Fact]
        public void Get_BuildingZoning_NoParcel()
        {
            // Arrange
            var building = new Building();

            // Act
            var zoning = building.GetZoning();

            // Assert
            Assert.Empty(zoning);
        }

        [Fact]
        public void Get_BuildingZoningPotential()
        {
            // Arrange
            var zoningPotential = "ZoningPotential";
            var parcel = new Parcel
            {
                ZoningPotential = zoningPotential
            };
            var building = new Building
            {
                Parcel = parcel
            };

            // Act
            var ActualZoningPotential = building.GetZoningPotential();

            // Assert
            Assert.Equal(ActualZoningPotential, zoningPotential);
        }

        [Fact]
        public void Get_BuildingZoningPotential_NoParcel()
        {
            // Arrange
            var building = new Building();

            // Act
            var zoningPotential = building.GetZoningPotential();

            // Assert
            Assert.Empty(zoningPotential);
        }
        #endregion
    }
}
