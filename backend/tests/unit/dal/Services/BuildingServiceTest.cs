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
                new object[] { new BuildingFilter(48.571155, -123.657596, 48.492947, -123.731803), 1 },
                new object[] { new BuildingFilter(48.821333, -123.795017, 48.763431, -123.959783), 0 },
                new object[] { new BuildingFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new BuildingFilter() { ClassificationId = 2 }, 1 },
                new object[] { new BuildingFilter() { Description = "DescriptionTest" }, 1 },
                new object[] { new BuildingFilter() { Tenancy = "BuildingTenancy" }, 1 },
                new object[] { new BuildingFilter() { AdministrativeArea = "AdministrativeArea" }, 5 },
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            buildings.Next(0).Location.X = -123.720810;
            buildings.Next(0).Location.Y = 48.529338;
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
            parcel2.Address.AdministrativeArea = "-AdministrativeArea-";
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
            Assert.NotNull(building.Address.AdministrativeArea);
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
            Assert.NotNull(building.Address.AdministrativeArea);
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
            Assert.NotNull(building.Address.AdministrativeArea);
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
        public void Update_Building_LinkedToProject_NotAllowed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;
            var building = init.CreateBuilding(null, 2, agency: project.Agency);
            var fiscal = init.CreateFiscal(building, 2020, Entity.FiscalKeys.NetBook, 10);
            project.AddProperty(building);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<BuildingService>(user, options);

            // Act
            building.Name = "change";

            // Assert, updating a building in a project should not throw an exception.
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(building));
        }

        [Fact]
        public void Update_Building_NoPermission_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var init = helper.InitializeDatabase(user);
            var building = init.CreateBuilding(1);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(building));
        }

        [Fact]
        public void Update_Building_WrongAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            var building = init.CreateBuilding(1);
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>();

            // Act
            building.Description = "a new description.";

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(building));
        }

        //This appears to cause a stack overflow in our github action. Will try and find time to look into this.
        //[Fact]
        //public void Update_Building_NotFound_KeyNotFound()
        //{
        //    // Arrange
        //    var helper = new TestHelper();
        //    var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
        //    var init = helper.InitializeDatabase(user);
        //    var building = init.CreateBuilding(1);
        //    var searchBuilding = EntityHelper.CreateBuilding(2);
        //    init.SaveChanges();

        //    var service = helper.CreateService<BuildingService>();

        //    // Act
        //    // Assert
        //    Assert.Throws<KeyNotFoundException>(() =>
        //        service.Update(searchBuilding));
        //}

        [Fact]
        public void Update_Building_InProject_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateBuilding(1);
            init.SaveChanges();
            parcel.ProjectNumbers = "[SPP-10000]";
            init.Update(parcel);
            init.SaveChanges();


            var service = helper.CreateService<BuildingService>();

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_BuildingFinancials()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(3);
            var building = init.CreateBuilding(parcel, 4);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<BuildingService>(user, options);

            // Act
            building.Evaluations.Add(new Entity.BuildingEvaluation(building, DateTime.Now, Entity.EvaluationKeys.Assessed, 1000));
            building.Fiscals.Add(new Entity.BuildingFiscal(building, 2021, Entity.FiscalKeys.Market, 1000));
            building.Fiscals.Add(new Entity.BuildingFiscal(building, 2021, Entity.FiscalKeys.NetBook, 2000));
            var result = service.UpdateFinancials(building);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(result.Evaluations, e => e.Key == Entity.EvaluationKeys.Assessed && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.Market && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.NetBook && e.Value == 2000);
        }
        #endregion
        #endregion
    }
}
