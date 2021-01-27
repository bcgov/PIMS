using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
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
    [Trait("group", "parcel")]
    [ExcludeFromCodeCoverage]
    public class ParcelServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilterData =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(48.571155, -123.657596, 48.492947, -123.731803), 1 },
                new object[] { new ParcelFilter(48.821333, -123.795017, 48.763431, -123.959783), 0 },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new ParcelFilter() { ClassificationId = 2 }, 1 },
                new object[] { new ParcelFilter() { Description = "DescriptionTest" }, 1 },
                new object[] { new ParcelFilter() { AdministrativeArea = "AdministrativeArea" }, 1 },
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

            using var init = helper.InitializeDatabase(user);
            var parcels = init.CreateParcels(1, 20);
            parcels.Next(0).Location.X = -123.720810;
            parcels.Next(0).Location.Y = 48.529338;
            parcels.Next(1).Agency = init.Agencies.Find(3);
            parcels.Next(1).AgencyId = 3;
            parcels.Next(2).ClassificationId = 2;
            parcels.Next(3).Description = "-DescriptionTest-";
            parcels.Next(4).Address.AdministrativeArea = "-AdministrativeArea-";
            parcels.Next(5).ProjectNumbers = "[\"ProjectNumber\"]";
            parcels.Next(6).Zoning = "-Zoning-";
            parcels.Next(7).ZoningPotential = "-ZoningPotential-";
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);
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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

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
        #endregion

        #region Delete Parcel
        /// <summary>
        /// Argument cannot be null.
        /// </summary>
        [Fact]
        public void Remove_ArgumentNull()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

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
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(parcel));
        }

        /// <summary>
        /// Parcel does not exist.
        /// </summary>
        [Fact]
        public void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties);
            var find = EntityHelper.CreateParcel(1, 1, 1, 1);
            var parcel = EntityHelper.CreateParcel(2, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Remove(find));
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Remove_SystemAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
        }

        /// <summary>
        /// Sensitive parcel found.
        /// </summary>
        [Fact]
        public void Remove_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyDelete, Permissions.AdminProperties).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
            Assert.True(parcel.IsSensitive);
        }
        #endregion

        #region Update Parcel
        [Fact]
        public void UpdateParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            updateParcel.Name = newName;

            // Act
            service.Update(updateParcel);

            // Assert
            parcel.Name.Should().Be(newName);
        }

        [Fact]
        public void UpdateParcelWithNewFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateParcel, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateParcel.Name = newName;

            // Act
            service.Update(updateParcel);

            // Assert
            parcel.Name.Should().Be(newName);
            parcel.Fiscals.Should().HaveCount(2);
            parcel.Fiscals.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateParcelWithFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            EntityHelper.CreateFiscals(parcel, new[] { 2017, 2018 }, Entity.FiscalKeys.NetBook, 2000);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateParcel, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateParcel.Name = newName;

            // Act
            service.Update(updateParcel);

            // Assert
            parcel.Name.Should().Be(newName);
            parcel.Fiscals.Should().HaveCount(3);
            parcel.Fiscals.Sum(f => f.Value).Should().Be(9000);
        }

        [Fact]
        public void UpdateParcelWithNewEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateParcel, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateParcel.Name = newName;

            // Act
            service.Update(updateParcel);

            // Assert
            parcel.Name.Should().Be(newName);
            parcel.Evaluations.Should().HaveCount(2);
            parcel.Evaluations.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateParcelWithEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            EntityHelper.CreateEvaluations(parcel, new DateTime(2017, 1, 1), 2, Entity.EvaluationKeys.Assessed, 2000);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateParcel, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateParcel.Name = newName;

            // Act
            service.Update(updateParcel);

            // Assert
            parcel.Name.Should().Be(newName);
            parcel.Evaluations.Should().HaveCount(3);
            parcel.Evaluations.Sum(f => f.Value).Should().Be(9000);
        }
        #endregion

        #region Update Parcel Financials
        [Fact]
        public void UpdateParcelFinancials_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var originalName = "original";
            parcel.Name = originalName;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            updateParcel.Name = newName;

            // Act
            service.UpdateFinancials(updateParcel);

            // Assert
            parcel.Name.Should().Be(originalName);
        }

        [Fact]
        public void UpdateParcelFinancialsWithNewFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var originalName = "original";
            parcel.Name = originalName;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateParcel, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateParcel.Name = newName;

            // Act
            service.UpdateFinancials(updateParcel);

            // Assert
            parcel.Name.Should().Be(originalName);
            parcel.Fiscals.Should().HaveCount(2);
            parcel.Fiscals.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateParcelFinancialsWithFiscals_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var originalName = "original";
            parcel.Name = originalName;
            EntityHelper.CreateFiscals(parcel, new[] { 2017, 2018 }, Entity.FiscalKeys.NetBook, 2000);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateFiscals(updateParcel, new[] { 2018, 2019 }, Entity.FiscalKeys.NetBook, 5000);
            updateParcel.Name = newName;

            // Act
            service.UpdateFinancials(updateParcel);

            // Assert
            parcel.Name.Should().Be(originalName);
            parcel.Fiscals.Should().HaveCount(3);
            parcel.Fiscals.Sum(f => f.Value).Should().Be(9000);
        }

        [Fact]
        public void UpdateParcelFinancialsWithNewEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var originalName = "original";
            parcel.Name = originalName;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateParcel, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateParcel.Name = newName;

            // Act
            service.UpdateFinancials(updateParcel);

            // Assert
            parcel.Name.Should().Be(originalName);
            parcel.Evaluations.Should().HaveCount(2);
            parcel.Evaluations.Sum(f => f.Value).Should().Be(10000);
        }

        [Fact]
        public void UpdateParcelFinancialsWithEvaluations_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.SystemAdmin);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var originalName = "original";
            parcel.Name = originalName;
            EntityHelper.CreateEvaluations(parcel, new DateTime(2017, 1, 1), 2, Entity.EvaluationKeys.Assessed, 2000);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>();

            var updateParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var newName = "testing name is updated";
            EntityHelper.CreateEvaluations(updateParcel, new DateTime(2018, 1, 1), 2, Entity.EvaluationKeys.Assessed, 5000);
            updateParcel.Name = newName;

            // Act
            service.UpdateFinancials(updateParcel);

            // Assert
            parcel.Name.Should().Be(originalName);
            parcel.Evaluations.Should().HaveCount(3);
            parcel.Evaluations.Sum(f => f.Value).Should().Be(9000);
        }
        #endregion
        #endregion
    }
}
