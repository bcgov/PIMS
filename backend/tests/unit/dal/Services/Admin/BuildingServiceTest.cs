using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services.Admin
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("area", "admin")]
    [Trait("group", "building")]
    [ExcludeFromCodeCoverage]
    public class BuildingServiceTest
    {
        #region Constructors
        public BuildingServiceTest() { }
        #endregion

        #region Tests
        #region Get Buildings
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
                service.Get(1, 10, null));
        }

        [Fact]
        public void Get_Buildings()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(21);
            var buildings = init.CreateBuildings(parcel, 1, 20);
            buildings.Next(0).Location.Y = 50;
            buildings.Next(0).Location.X = 25;
            buildings.Next(1).Agency = init.Agencies.Find(3);
            buildings.Next(1).AgencyId = 3;
            buildings.Next(2).ClassificationId = 2;
            buildings.Next(3).Description = "-DescriptionTest-";
            buildings.Next(5).ProjectNumbers = "[\"ProjectNumber\"]";
            init.SaveChanges();

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1, 10, null);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Paged<Entity.Building>>(result);
            Assert.Equal(10, result.Items.Count());
        }
        #endregion

        #region Get Building
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
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// Building does not exist.
        /// </summary>
        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(12));
        }

        /// <summary>
        /// Building found.
        /// </summary>
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(building, result, new ShallowPropertyCompare());
        }

        /// <summary>
        /// Buildings found using PID.
        /// </summary>
        [Fact]
        public void GetByName()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2, null, "test building");
            var building2 = init.CreateBuilding(parcel, 3, null, "test building");
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByName(building.Name).ToList();

            // Assert
            Assert.NotNull(results);
            Assert.NotEmpty(results);
            Assert.Collection(results,
            item => Assert.Equal(building.Name.ToString(), item.Name.ToString()),
        item => Assert.Equal(building2.Name.ToString(), item.Name.ToString()));
        }

        /// <summary>
        /// Buildings found using PID.
        /// </summary>
        [Fact]
        public void GetByPid()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var building2 = init.CreateBuilding(parcel, 3);
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByPid(parcel.PID).ToList();

            // Assert
            Assert.NotNull(results);
            Assert.NotEmpty(results);
            Assert.Collection(results,
            item => Assert.Equal(building.Address.ToString(), item.Address.ToString()),
        item => Assert.Equal(building2.Address.ToString(), item.Address.ToString()));
        }

        /// <summary>
        /// Buildings found using PID and building name
        /// </summary>
        [Fact]
        public void GetByPidWithoutTracking()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2, null, "test building");
            var building2 = init.CreateBuilding(parcel, 3, null, "test building");
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByPidWithoutTracking(parcel.PID, building.Name);

            // Assert
            Assert.NotNull(results);
            Assert.NotEmpty(results);
            Assert.Collection(results,
            item => Assert.Equal(building.Address.ToString(), item.Address.ToString()),
        item => Assert.Equal(building2.Address.ToString(), item.Address.ToString()));
        }

        /// <summary>
        /// Buildings found using PID and building name where pid is defined
        /// </summary>
        [Fact]
        public void GetByPidNameWithoutTracking_WithPID()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2, null, "test building");
            var building2 = init.CreateBuilding(parcel, 3, null, "test building");
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByPidNameWithoutTracking(parcel.PID, building.Name);

            // Assert
            Assert.NotNull(results);
            Assert.NotEmpty(results);
            Assert.Collection(results,
            item => Assert.Equal(building.Address.ToString(), item.Address.ToString()),
        item => Assert.Equal(building2.Address.ToString(), item.Address.ToString()));
        }

        /// <summary>
        /// Buildings found using PID and building name where pid is 0 (not defined)
        /// </summary>
        [Fact]
        public void GetByPidNameWithoutTracking_WithoutPID()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(0);
            var building = init.CreateBuilding(parcel, 2, null, "test building");
            var building2 = init.CreateBuilding(parcel, 3, null, "test building");
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByPidNameWithoutTracking(parcel.PID, building.Name);

            // Assert
            Assert.NotNull(results);
            Assert.Empty(results);
        }

        /// <summary>
        /// Buildings found using PID and building name
        /// </summary>
        [Fact]
        public void GetByNameAddressWithoutTracking()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2, null, "test building");
            var building2 = init.CreateBuilding(parcel, 3, null, "test building");
            init.AddAndSaveChanges(building, building2);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var results = service.GetByNameAddressWithoutTracking(building.Name, building.Address.Address1);

            // Assert
            Assert.NotNull(results);
            Assert.NotEmpty(results);
            Assert.Collection(results,
            item => Assert.Equal(building.Address.ToString(), item.Address.ToString()),
        item => Assert.Equal(building2.Address.ToString(), item.Address.ToString()));
            Assert.Collection(results,
            item => Assert.Equal(building.Parcels.First().ParcelId, item.Parcels.First().ParcelId),
        item => Assert.Equal(building2.Parcels.First().ParcelId, item.Parcels.First().ParcelId));
        }

        /// <summary>
        /// Sensitive building found.
        /// </summary>
        [Fact]
        public void Get_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.SensitiveView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            building.IsSensitive = true;
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            var result = service.Get(2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(building, result, new ShallowPropertyCompare());
            Assert.True(result.IsSensitive);
        }
        #endregion

        #region Delete Building
        /// <summary>
        /// Argument cannot be null.
        /// </summary>
        [Fact]
        public void Remove_ArgumentNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.Remove(null));
        }

        /// <summary>
        /// User does not have 'property-delete' claim.
        /// </summary>
        [Fact]
        public void Remove_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(building));
        }

        /// <summary>
        /// Building does not exist.
        /// </summary>
        [Fact]
        public void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var find = EntityHelper.CreateBuilding(parcel, 3);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Remove(find));
        }

        /// <summary>
        /// Building found.
        /// </summary>
        [Fact]
        public void Remove_SystemAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(building);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(building).State);
        }

        /// <summary>
        /// Sensitive building found.
        /// </summary>
        [Fact]
        public void Remove_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            building.IsSensitive = true;
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(building);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(building).State);
            Assert.True(building.IsSensitive);
        }
        #endregion

        #region Update Building
        [Fact]
        public void UpdateBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var options = Options.Create<PimsOptions>(new PimsOptions());
            var service = helper.CreateService<BuildingService>(options);

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            updateBuilding.Name = newName;

            // Act
            service.Update(updateBuilding);

            // Assert
            building.Name.Should().Be(newName);
        }

        [Fact]
        public void UpdateBuildingWithNewFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var options = Options.Create<PimsOptions>(new PimsOptions());
            var service = helper.CreateService<BuildingService>(options);

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateBuilding, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateBuilding.Name = newName;

            // Act
            service.Update(updateBuilding);

            // Assert
            building.Name.Should().Be(newName);
            building.Fiscals.Should().HaveCount(2);
            building.Fiscals.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateBuildingWithFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.CreateFiscals(building, new[] { 2017, 2018 }, Entity.FiscalKeys.NetBook, 2000);
            init.AddAndSaveChanges(building);

            var options = Options.Create<PimsOptions>(new PimsOptions());
            var service = helper.CreateService<BuildingService>(options);

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateBuilding, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateBuilding.Name = newName;

            // Act
            service.Update(updateBuilding);

            // Assert
            building.Name.Should().Be(newName);
            building.Fiscals.Should().HaveCount(3);
            building.Fiscals.Sum(f => f.Value).Should().Be(9000);
        }

        [Fact]
        public void UpdateBuildingWithNewEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.AddAndSaveChanges(building);

            var options = Options.Create<PimsOptions>(new PimsOptions());
            var service = helper.CreateService<BuildingService>(options);

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateBuilding, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateBuilding.Name = newName;

            // Act
            service.Update(updateBuilding);

            // Assert
            building.Name.Should().Be(newName);
            building.Evaluations.Should().HaveCount(2);
            building.Evaluations.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateBuildingWithEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.CreateEvaluations(building, new DateTime(2017, 1, 1), 2, Entity.EvaluationKeys.Assessed, 2000);
            init.AddAndSaveChanges(building);

            var options = Options.Create<PimsOptions>(new PimsOptions());
            var service = helper.CreateService<BuildingService>(options);

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateBuilding, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateBuilding.Name = newName;

            // Act
            service.Update(updateBuilding);

            // Assert
            building.Name.Should().Be(newName);
            building.Evaluations.Should().HaveCount(3);
            building.Evaluations.Sum(f => f.Value).Should().Be(9000);
        }
        #endregion

        #region Update Building Financials
        [Fact]
        public void UpdateBuildingFinancials_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var originalName = "original";
            building.Name = originalName;
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>();

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            updateBuilding.Name = newName;

            // Act
            service.UpdateFinancials(updateBuilding);

            // Assert
            building.Name.Should().Be(originalName);
        }

        [Fact]
        public void UpdateBuildingFinancialsWithNewFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var originalName = "original";
            building.Name = originalName;
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>();

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateBuilding, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateBuilding.Name = newName;

            // Act
            service.UpdateFinancials(updateBuilding);

            // Assert
            building.Name.Should().Be(originalName);
            building.Fiscals.Should().HaveCount(2);
            building.Fiscals.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateBuildingFinancialsWithFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var originalName = "original";
            building.Name = originalName;
            init.CreateFiscals(building, new[] { 2017, 2018 }, Entity.FiscalKeys.NetBook, 2000);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>();

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateBuilding, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateBuilding.Name = newName;

            // Act
            service.UpdateFinancials(updateBuilding);

            // Assert
            building.Name.Should().Be(originalName);
            building.Fiscals.Should().HaveCount(3);
            building.Fiscals.Sum(f => f.Value).Should().Be(9000);
        }

        [Fact]
        public void UpdateBuildingFinancialsWithNewEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var originalName = "original";
            building.Name = originalName;
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>();

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateBuilding, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateBuilding.Name = newName;

            // Act
            service.UpdateFinancials(updateBuilding);

            // Assert
            building.Name.Should().Be(originalName);
            building.Evaluations.Should().HaveCount(2);
            building.Evaluations.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateBuildingFinancialsWithEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var originalName = "original";
            building.Name = originalName;
            init.CreateEvaluations(building, new DateTime(2017, 1, 1), 2, Entity.EvaluationKeys.Assessed, 2000);
            init.AddAndSaveChanges(building);

            var service = helper.CreateService<BuildingService>();

            var updateBuilding = EntityHelper.CreateBuilding(parcel, 2);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateBuilding, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateBuilding.Name = newName;

            // Act
            service.UpdateFinancials(updateBuilding);

            // Assert
            building.Name.Should().Be(originalName);
            building.Evaluations.Should().HaveCount(3);
            building.Evaluations.Sum(f => f.Value).Should().Be(9000);
        }
        #endregion
        #endregion
    }
}
