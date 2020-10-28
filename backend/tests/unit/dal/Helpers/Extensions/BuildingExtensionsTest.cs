using FluentAssertions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;

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
            var building = new Building();
            building.Parcels.Add(new ParcelBuilding(parcel, building));

            // Act
            var zoning = building.GetZoning();

            // Assert
            Assert.NotNull(zoning);
            Assert.IsAssignableFrom<IEnumerable<string>>(zoning);
            zoning.Should().HaveCount(1);
            zoning.First().Should().Be(zone);
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
            var zonePotential = "ZoningPotential";
            var parcel = new Parcel
            {
                ZoningPotential = zonePotential
            };
            var building = new Building();
            building.Parcels.Add(new ParcelBuilding(parcel, building));

            // Act
            var zoningPotential = building.GetZoningPotential();

            // Assert
            Assert.NotNull(zoningPotential);
            Assert.IsAssignableFrom<IEnumerable<string>>(zoningPotential);
            zoningPotential.Should().HaveCount(1);
            zoningPotential.First().Should().Be(zonePotential);
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
