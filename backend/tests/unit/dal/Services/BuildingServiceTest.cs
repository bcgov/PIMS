using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "building")]
    [ExcludeFromCodeCoverage]
    public class BuildingServiceTest
    {
        #region Data
        public static IEnumerable<object[]> BuildingFilters =>
            new List<object[]>
            {
                new object[] { new BuildingFilter(50, 25, 50, 20), 1 },
                new object[] { new BuildingFilter(50, 24, 50, 26), 0 },
                new object[] { new BuildingFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new BuildingFilter() { ClassificationId = 2 }, 1 },
                new object[] { new BuildingFilter() { Description = "DescriptionTest" }, 1 },
                new object[] { new BuildingFilter() { Tenancy = "BuildingTenancy" }, 1 },
                new object[] { new BuildingFilter() { Municipality = "Municipality" }, 5 },
                new object[] { new BuildingFilter() { ConstructionTypeId = 2 }, 1 },
                new object[] { new BuildingFilter() { PredominateUseId = 2 }, 1 },
                new object[] { new BuildingFilter() { MinRentableArea = 100 }, 1 },
                new object[] { new BuildingFilter() { MinRentableArea = 50, MaxRentableArea = 50 }, 1 }
            };
        #endregion

        #region Constructors
        public BuildingServiceTest() { }
        #endregion

        #region Tests
        #region Get Buildings
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Buildings_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.Get(null));
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

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get(filter));
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void Get_Buildings(BuildingFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1, 3);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 2, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(22);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 23, 5);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(expectedCount);
        }

        [Fact]
        public void Get_Buildings_OnlyAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(3);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 2, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(22);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 23, 5);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(new BuildingFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(1);
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void Get_Buildings_AsAdmin(BuildingFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 2, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(22);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 23, 5);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(expectedCount);
        }

        [Fact]
        public void Get_Buildings_AsAdmin_AllAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 2, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(22);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 23, 5);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(new BuildingFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(25);
        }
        #endregion

        #region Get Paged Buildings
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Page_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetPage(null));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Page_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new BuildingFilter(50, 25, 50, 20);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void Get_Page(BuildingFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1, 3);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 10, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(2);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 31, 5);

            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(expectedCount);
        }

        [Fact]
        public void Get_Page_OnlyAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(3);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 10, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(2);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 31, 5);

            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.GetPage(new BuildingFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(1);
        }

        [Theory]
        [MemberData(nameof(BuildingFilters))]
        public void Get_Page_AsAdmin(BuildingFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 10, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(2);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 31, 5);

            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(expectedCount);
        }

        [Fact]
        public void Get_Page_AsAdmin_AllAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var parcel1 = init.CreateParcel(1);
            var buildings = init.CreateBuildings(parcel1, 10, 20);
            buildings.Next(0).Latitude = 50;
            buildings.Next(0).Longitude = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(4).BuildingTenancy = "-BuildingTenancy-";
            buildings.Next(5).BuildingConstructionTypeId = 2;
            buildings.Next(6).BuildingPredominateUseId = 2;
            buildings.Next(7).RentableArea = 100;
            buildings.Next(8).RentableArea = 50;

            var parcel2 = init.CreateParcel(2);
            parcel2.Municipality = "-Municipality-";
            init.CreateBuildings(parcel2, 31, 5);

            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.GetPage(new BuildingFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Building>>(result);
            result.Should().HaveCount(10);
            result.Total.Should().Be(25);
        }
        #endregion

        #region Get Building
        /// <summary>
        /// Building does not exist.
        /// </summary>
        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// User does not have 'sensitive-view' claim.
        /// </summary>
        [Fact]
        public void Get_Sensitive_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            building.IsSensitive = true;
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// User is attempting to view sensitive building from another agency.
        /// </summary>
        [Fact]
        public void Get_Sensitive_WrongAgency()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            building.IsSensitive = true;
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(2));
        }

        /// <summary>
        /// User is attempting to view sensitive building from another agency.
        /// </summary>
        [Fact]
        public void Get_Sensitive_WrongAgency_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            building.IsSensitive = true;
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(building, result, new ShallowPropertyCompare());
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address.City);
            Assert.NotNull(building.Address.Province);
            Assert.NotNull(building.Classification);
            Assert.NotNull(building.Agency);
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address);
            // TODO: Add asserts for Evaluations
            // TODO: Add asserts for Fiscals
        }

        /// <summary>
        /// Building found.
        /// </summary>
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(building, result, new ShallowPropertyCompare());
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address.City);
            Assert.NotNull(building.Address.Province);
            Assert.NotNull(building.Classification);
            Assert.NotNull(building.Agency);
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address);
            // TODO: Add asserts for Evaluations
            // TODO: Add asserts for Fiscals
        }

        /// <summary>
        /// Building found.
        /// </summary>
        [Fact]
        public void Get_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);
            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(building, result, new ShallowPropertyCompare());
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address.City);
            Assert.NotNull(building.Address.Province);
            Assert.NotNull(building.Classification);
            Assert.NotNull(building.Agency);
            Assert.NotNull(building.Address);
            Assert.NotNull(building.Address);
            // TODO: Add asserts for Evaluations
            // TODO: Add asserts for Fiscals
        }
        #endregion

        #region Update Building

        [Fact]
        public void Update_Building_LinkedToProject_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var fiscal = init.CreateFiscal(building, 2020, Entity.FiscalKeys.NetBook, 10);
            project.AddProperty(parcel);
            project.AddProperty(building);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<BuildingService>(user, options);

            // Act
            building.Name = "change";

            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(building));
        }
        #endregion
        #endregion
    }
}
