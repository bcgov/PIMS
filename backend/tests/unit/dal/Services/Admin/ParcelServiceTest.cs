using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services.Admin
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("area", "admin")]
    [Trait("group", "parcel")]
    public class ParcelServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilterData =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(50, 25, 50, 20), 1 },
                new object[] { new ParcelFilter(50, 24, 50, 26), 0 },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new ParcelFilter() { ClassificationId = 2 }, 1 },
                new object[] { new ParcelFilter() { Description = "Description" }, 1 },
                new object[] { new ParcelFilter() { Municipality = "Municipality" }, 1 },
                new object[] { new ParcelFilter() { ProjectNumber = "ProjectNumber" }, 1 },
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
            var user = PrincipalHelper.CreateForPermission();
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
        [MemberData(nameof(ParcelFilterData))]
        public void Get_Parcels(ParcelFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);

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
            parcels.Next(5).ProjectNumber = "ProjectNumber";
            parcels.Next(6).Zoning = "-Zoning-";
            parcels.Next(7).ZoningPotential = "-ZoningPotential-";
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Paged<Entity.Parcel>>(result);
            Assert.Equal(expectedCount, result.Items.Count());
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
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
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
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(2, 1, 1, 1);
            var dbName = StringHelper.Generate(10);
            helper.CreatePimsContext(dbName, user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(dbName, user);
            var context = helper.GetService<PimsContext>();

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
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
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
        }

        /// <summary>
        /// Sensitive parcel found.
        /// </summary>
        [Fact]
        public void Get_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.SensitiveView).AddAgency(1);
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
        #endregion
        #endregion
    }
}
