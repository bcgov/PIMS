using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "parcel")]
    public class ParcelServiceTest
    {
        #region Constructors
        public ParcelServiceTest() { }
        #endregion

        #region Tests
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
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
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
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

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
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

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
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
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
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
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

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1, 1, 1);
            parcel.Buildings.Add(init.CreateBuilding(parcel, 1));
            var sensitive = init.CreateBuilding(parcel, 2);
            sensitive.IsSensitive = true;
            parcel.Buildings.Add(sensitive);
            init.AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
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
            helper.CreatePimsContext(user, true).AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
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

            using var init = helper.InitializeDatabase(user);
            var agency = init.Agencies.Find(1);
            var parcel = init.CreateParcel(1, agency);
            parcel.IsSensitive = true;
            parcel.Buildings.Add(init.CreateBuilding(parcel, 1));
            var building1 = init.CreateBuilding(parcel, 2);
            building1.IsSensitive = true;
            var building2 = init.CreateBuilding(parcel, 3, "l3", 1, 1, init.Agencies.Find(2));
            building2.IsSensitive = true;
            parcel.Buildings.Add(building1);
            parcel.Buildings.Add(building2);
            init.AddOne(parcel);

            var service = helper.CreateService<ParcelService>(user);
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
