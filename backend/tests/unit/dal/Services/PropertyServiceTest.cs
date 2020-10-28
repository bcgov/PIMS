using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "property")]
    [ExcludeFromCodeCoverage]
    public class PropertyServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilters =>
            new List<object[]>
            {
                new object[] { new AllPropertyFilter(48.571155, -123.657596, 48.492947, -123.731803) { PropertyType = Entity.PropertyTypes.Land }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter(48.821333, -123.795017, 48.763431, -123.959783) { PropertyType = Entity.PropertyTypes.Land }, new[] { 1, 3 }, 0, 0 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, Agencies = new int[] { 3 } }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, ClassificationId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, Description = "DescriptionTest" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, AdministrativeArea = "AdministrativeArea" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, Zoning = "Zoning" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, ZoningPotential = "ZoningPotential" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land }, new[] { 3 }, 1, 1 },
            };

        public static IEnumerable<object[]> BuildingFilters =>
            new List<object[]>
            {
                new object[] { new AllPropertyFilter(48.571155, -123.657596, 48.492947, -123.731803) { PropertyType = Entity.PropertyTypes.Building }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter(48.821333, -123.795017, 48.763431, -123.959783) { PropertyType = Entity.PropertyTypes.Building }, new[] { 1, 3 }, 0, 0 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building, Agencies = new int[] { 3 } }, new[] { 1, 3 }, 6, 6 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building, ClassificationId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building, Description = "DescriptionTest" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building, AdministrativeArea = "AdministrativeArea" }, new[] { 1, 3 }, 10, 10 },
                new object[] { new AllPropertyFilter() { Tenancy = "BuildingTenancy" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { ConstructionTypeId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PredominateUseId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 100 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 50, MaxRentableArea = 50 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building }, new[] { 3 }, 6, 6 },
            };

        public static IEnumerable<object[]> AllPropertyFilters =>
            new List<object[]>
            {
                new object[] { new AllPropertyFilter(48.571155, -123.657596, 48.492947, -123.731803), new[] { 1, 3 }, 2, 2 },
                new object[] { new AllPropertyFilter(48.821333, -123.795017, 48.763431, -123.959783), new[] { 1, 3 }, 0, 0 },
                new object[] { new AllPropertyFilter() { Agencies = new int[] { 3 } }, new[] { 1, 3 }, 7, 7 },
                new object[] { new AllPropertyFilter() { ClassificationId = 2 }, new[] { 1, 3 }, 2, 2 },
                new object[] { new AllPropertyFilter() { Page = 1, Quantity = 10, Description = "DescriptionTest" }, new[] { 1, 3 }, 2, 2 },
                new object[] { new AllPropertyFilter() { AdministrativeArea = "AdministrativeArea" }, new[] { 1, 3 }, 11, 10 },
                new object[] { new AllPropertyFilter() { Tenancy = "BuildingTenancy" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { Zoning = "Zoning" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { ZoningPotential = "ZoningPotential" }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { ConstructionTypeId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PredominateUseId = 2 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 100 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { MinRentableArea = 50, MaxRentableArea = 50 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Building, ClassificationId = 3 }, new[] { 1, 3 }, 10, 10 },
                new object[] { new AllPropertyFilter() { PropertyType = Entity.PropertyTypes.Land, ClassificationId = 3 }, new[] { 1, 3 }, 1, 1 },
                new object[] { new AllPropertyFilter() { Quantity = 5, MinLandArea = 5000, MaxLandArea = 10000 }, new[] { 1, 3 }, 11, 5 },
                new object[] { new AllPropertyFilter() { Quantity = 2, ClassificationId = 3 }, new[] { 1, 3 }, 11, 2 },
                new object[] { new AllPropertyFilter(), new[] { 3 }, 7, 7 },
            };
        #endregion

        #region Constructors
        public PropertyServiceTest() { }
        #endregion

        #region Tests
        #region Get Paged Properties
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void GetPage_Properties_ArgumentNullException()
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
        public void GetPage_Properties_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new AllPropertyFilter(50, 25, 50, 20);

            var service = helper.CreateService<PropertyService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        [Theory]
        [MemberData(nameof(ParcelFilters))]
        public void GetPage_ParcelProperties(AllPropertyFilter filter, int[] agencyIds, int expectedTotal, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(agencyIds);

            using var init = helper.InitializeDatabase(user);

            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Location.X = -123.720810;
            parcels.Next(0).Location.Y = 48.529338;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-DescriptionTest-";
            parcels.Next(4).Address.AdministrativeArea = "-AdministrativeArea-";
            parcels.Next(5).Zoning = "-Zoning-";
            parcels.Next(6).ZoningPotential = "-ZoningPotential-";

            var buildings = init.CreateBuildings(parcels.First(), 50, 5);
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";

            buildings.AddRange(init.CreateBuildings(parcels.Next(1), 56, 5));
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            buildings.AddRange(init.CreateBuildings(parcels.Next(4), 61, 10));

            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedTotal, result.Total);
            Assert.Equal(expectedCount, result.Count());
            Assert.True(result.All(p => p.PropertyTypeId == Entity.PropertyTypes.Land));
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void GetPage_BuildingProperties(AllPropertyFilter filter, int[] agencyIds, int expectedTotal, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(agencyIds);

            using var init = helper.InitializeDatabase(user);

            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Location.X = -123.720810;
            parcels.Next(0).Location.Y = 48.529338;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-DescriptionTest-";
            parcels.Next(4).Address.AdministrativeArea = "-AdministrativeArea-";
            parcels.Next(5).Zoning = "-Zoning-";
            parcels.Next(6).ZoningPotential = "-ZoningPotential-";

            var buildings = init.CreateBuildings(parcels.First(), 50, 5);
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";

            buildings.AddRange(init.CreateBuildings(parcels.Next(1), 56, 5));
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            buildings.AddRange(init.CreateBuildings(parcels.Next(4), 61, 10));

            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedTotal, result.Total);
            Assert.Equal(expectedCount, result.Count());
            Assert.True(result.All(p => p.PropertyTypeId == Entity.PropertyTypes.Building));
        }

        [Theory]
        [MemberData(nameof(AllPropertyFilters))]
        public void GetPage_Properties(AllPropertyFilter filter, int[] agencyIds, int expectedTotal, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(agencyIds);

            using var init = helper.InitializeDatabase(user);

            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Location.X = -123.720810;
            parcels.Next(0).Location.Y = 48.529338;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-DescriptionTest-";
            parcels.Next(4).Address.AdministrativeArea = "-AdministrativeArea-";
            parcels.Next(5).Zoning = "-Zoning-";
            parcels.Next(6).ZoningPotential = "-ZoningPotential-";
            parcels.Next(7).LandArea = 5500.55f;

            var classification = init.PropertyClassifications.Find(3);
            parcels.Next(8).Classification = classification;
            parcels.Next(8).ClassificationId = classification.Id;

            var buildings = init.CreateBuildings(parcels.First(), 50, 5);
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";

            buildings.AddRange(init.CreateBuildings(parcels.Next(1), 56, 5));
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            buildings.AddRange(init.CreateBuildings(parcels.Next(4), 61, 10));

            var buildings01 = init.CreateBuildings(parcels.Next(7), 100, 10);
            buildings01.ForEach(b =>
            {
                b.Classification = classification;
                b.ClassificationId = classification.Id;
            });
            buildings.AddRange(buildings01);

            init.SaveChanges();

            var service = helper.CreateService<PropertyService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Views.Property>>(result);
            Assert.Equal(expectedTotal, result.Total);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion
        #endregion
    }
}
