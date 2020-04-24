using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "property")]
    public class PropertyServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilters =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(50, 25, 50, 20), 1 },
                new object[] { new ParcelFilter(50, 24, 50, 26), 0 },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new ParcelFilter() { ClassificationId = 2 }, 1 },
                new object[] { new ParcelFilter() { Description = "Description" }, 1 },
                new object[] { new ParcelFilter() { Municipality = "Municipality" }, 1 },
                new object[] { new ParcelFilter() { Zoning = "Zoning" }, 1 },
                new object[] { new ParcelFilter() { ZoningPotential = "ZoningPotential" }, 1 }
            };

        public static IEnumerable<object[]> BuildingFilters =>
            new List<object[]>
            {
                new object[] { new BuildingFilter(50, 25, 50, 20), 1 },
                new object[] { new BuildingFilter(50, 24, 50, 26), 0 },
                new object[] { new BuildingFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new BuildingFilter() { ClassificationId = 2 }, 1 },
                new object[] { new BuildingFilter() { Description = "Description" }, 1 },
                new object[] { new BuildingFilter() { Tenancy = "BuildingTenancy" }, 1 },
                new object[] { new BuildingFilter() { ConstructionTypeId = 2 }, 1 },
                new object[] { new BuildingFilter() { PredominateUseId = 2 }, 1 },
                new object[] { new BuildingFilter() { MinRentableArea = 100 }, 1 },
                new object[] { new BuildingFilter() { MinRentableArea = 50, MaxRentableArea = 50 }, 1 }
            };

        public static IEnumerable<object[]> AllPropertyFilters =>
            new List<object[]>
            {
                new object[] { new AllPropertyFilter(50, 25, 50, 20), 2 },
                new object[] { new AllPropertyFilter(50, 24, 50, 26), 0 },
                new object[] { new AllPropertyFilter() { Agencies = new int[] { 3 } }, 7 },
                new object[] { new AllPropertyFilter() { ClassificationId = 2 }, 2 },
                new object[] { new AllPropertyFilter() { Description = "Description" }, 10 },
                new object[] { new AllPropertyFilter() { Municipality = "Municipality" }, 1 },
                new object[] { new AllPropertyFilter() { Tenancy = "BuildingTenancy" }, 1 },
                new object[] { new AllPropertyFilter() { Zoning = "Zoning" }, 10 },
                new object[] { new AllPropertyFilter() { ZoningPotential = "ZoningPotential" }, 10 },
                new object[] { new AllPropertyFilter() { ConstructionTypeId = 2 }, 1 },
                new object[] { new AllPropertyFilter() { PredominateUseId = 2 }, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 100 }, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 50, MaxRentableArea = 50 }, 1 },
            };
        #endregion

        #region Constructors
        public PropertyServiceTest() { }
        #endregion

        #region Tests
        #region Get Paged Parcels
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Properties_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetPage((AllPropertyFilter)null));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Parcels_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetPage((ParcelFilter)null));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Buildings_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetPage((BuildingFilter)null));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Properties_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new ParcelFilter(50, 25, 50, 20);

            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Parcels_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new ParcelFilter(50, 25, 50, 20);

            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Buildings_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new BuildingFilter(50, 25, 50, 20);

            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        [Theory]
        [MemberData(nameof(ParcelFilters))]
        public void Get_Parcels(ParcelFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var dbName = StringHelper.Generate(10);
            using var init = helper.InitializeDatabase(dbName, user);
            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Latitude = 50;
            parcels.Next(0).Longitude = 25;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-Description-";
            parcels.Next(4).Municipality = "-Municipality-";
            parcels.Next(5).Zoning = "-Zoning-";
            parcels.Next(6).ZoningPotential = "-ZoningPotential-";
            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(dbName, user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedCount, result.Count());
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void Get_Buildings(BuildingFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var dbName = StringHelper.Generate(10);
            using var init = helper.InitializeDatabase(dbName, user);
            var parcel = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel, 2, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-Description-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;
            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(dbName, user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedCount, result.Count());
        }

        [Theory]
        [MemberData(nameof(AllPropertyFilters))]
        public void Get_Properties(AllPropertyFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var dbName = StringHelper.Generate(10);
            using var init = helper.InitializeDatabase(dbName, user);

            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Latitude = 50;
            parcels.Next(0).Longitude = 25;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-Description-";
            parcels.Next(4).Municipality = "-Municipality-";
            parcels.Next(5).Zoning = "-Zoning-";
            parcels.Next(6).ZoningPotential = "-ZoningPotential-";

            var buildings = init.CreateBuildings(parcels.First(), 50, 5);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-Description-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";

            buildings.AddRange(init.CreateBuildings(parcels.Next(1), 56, 5));
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            buildings.AddRange(init.CreateBuildings(parcels.Next(2), 61, 10));

            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(dbName, user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion
        #endregion
    }
}
