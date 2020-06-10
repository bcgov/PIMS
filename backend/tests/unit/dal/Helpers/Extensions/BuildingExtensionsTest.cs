using System.Security.Policy;
using Xunit;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Dal.Test.Helpers.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "building_extensions")]
    public class BuildingExtensionsTest
    {
        #region Tests

        [Fact]
        public void Get_BuildingZoning()
        {
            // arrange
            var zone = "Zoning";
            var parcel = new Parcel();
            parcel.Zoning = zone;
            var building = new Building();
            building.Parcel = parcel;

            // act
            var zoning = building.GetZoning();

            // Assert
            Assert.Equal(zoning, zone);

        }


        [Fact]
        public void Get_BuildingZoning_NoParcel()
        {
            // arrange
            var building = new Building();

            // act
            var zoning = building.GetZoning();

            // Assert
            Assert.Empty(zoning);

        }

        [Fact]
        public void Get_BuildingZoningPotential()
        {
            // arrange
            var zoningPotential = "ZoningPotential";
            var parcel = new Parcel();
            parcel.ZoningPotential = zoningPotential;
            var building = new Building();
            building.Parcel = parcel;

            // act
            var actualZoningPotential = building.GetZoningPotential();

            // Assert
            Assert.Equal(actualZoningPotential, zoningPotential);

        }

        [Fact]
        public void Get_BuildingZoningPotential_NoParcel()
        {
            // arrange
            var building = new Building();

            // act
            var zoningPotential = building.GetZoningPotential();

            // Assert
            Assert.Empty(zoningPotential);

        }
        #endregion

    }
}
