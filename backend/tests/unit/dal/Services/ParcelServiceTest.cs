using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
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
    [Trait("group", "parcel")]
    public class ParcelServiceTest
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
        #endregion

        #region Constructors
        public ParcelServiceTest() { }
        #endregion

        #region Tests
        #region Get Parcels
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Parcels_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.Get(null));
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

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get(filter));
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

            var service = helper.CreateService<ParcelService>(dbName, user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion

        #region Get Paged Parcels
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_Page_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<ParcelService>(user);

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
            var filter = new ParcelFilter(50, 25, 50, 20);

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        [Theory]
        [MemberData(nameof(ParcelFilters))]
        public void Get_Page(ParcelFilter filter, int expectedCount)
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

            var service = helper.CreateService<ParcelService>(dbName, user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion

        #region Get Parcel
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);

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
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// Parcel does not exist.
        /// </summary>
        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(2, 1, 1, 1);
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// User is attempting to view sensitive parcel from another agency.
        /// </summary>
        [Fact]
        public void Get_Sensitive_WrongAgency()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(1));
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address.City);
            Assert.NotNull(parcel.Address.Province);
            Assert.NotNull(parcel.Status);
            Assert.NotNull(parcel.Classification);
            Assert.NotNull(parcel.Agency);
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address);
            // TODO: Add asserts for Buildings
            // TODO: Add asserts for Evaluations
        }

        /// <summary>
        /// Parcel found, but user does not have 'sensitive-view' claim.
        /// Remove sensitive buildings.
        /// </summary>
        [Fact]
        public void Get_RemoveSensitiveBuildings()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            var dbName = StringHelper.Generate(10);
            using var init = helper.InitializeDatabase(dbName, user);
            var parcel = init.CreateParcel(1, 1, 1);
            init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
            Assert.Single(result.Buildings);
            Assert.False(result.IsSensitive);
            Assert.False(result.Buildings.First().IsSensitive);
        }

        /// <summary>
        /// Sensitive parcel found.
        /// </summary>
        [Fact]
        public void Get_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
            Assert.True(result.IsSensitive);
        }

        /// <summary>
        /// Sensitive parcel found, sensitive buildings belonging to another agency are removed.
        /// </summary>
        [Fact]
        public void Get_WithAgency_RemoveSensitiveBuildings()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView).AddAgency(1);

            var dbName = StringHelper.Generate(10);
            using var init = helper.InitializeDatabase(dbName, user);
            var agency = init.Agencies.Find(1);
            var parcel = init.CreateParcel(1, agency);
            parcel.IsSensitive = true;
            init.CreateBuilding(parcel, 2);
            var building1 = init.CreateBuilding(parcel, 3);
            building1.IsSensitive = true;
            var building2 = init.CreateBuilding(parcel, 4, "13", "l4", 1, 1, init.Agencies.Find(2));
            building2.IsSensitive = true;
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
            Assert.Equal(2, result.Buildings.Count());
            Assert.True(result.IsSensitive);
            Assert.Equal(1, result.Buildings.Count(b => b.IsSensitive));
        }
        #endregion
        #endregion
    }
}
