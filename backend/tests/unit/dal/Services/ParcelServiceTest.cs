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
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Services
{
    [Trait("category", "unit")]
    [Trait("category", "dal")]
    [Trait("group", "parcel")]
    [ExcludeFromCodeCoverage]
    public class ParcelServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilters =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(48.571155, -123.657596, 48.492947, -123.731803), new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter(48.821333, -123.795017, 48.763431, -123.959783), new[] { 1, 3 }, 0 },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } }, new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter() { ClassificationId = 2 }, new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter() { Description = "DescriptionTest" }, new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter() { AdministrativeArea = "AdministrativeArea" }, new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter() { Zoning = "Zoning" }, new[] { 1, 3 }, 1 },
                new object[] { new ParcelFilter() { ZoningPotential = "ZoningPotential" }, new[] { 1, 3 }, 1 }
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
        public void Get_Parcels(ParcelFilter filter, int[] agencyIds, int expectedCount)
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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedCount, result.Count());
        }

        [Fact]
        public void Get_Parcels_OnlyAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(3);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.Get(new ParcelFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            result.Should().HaveCount(1);
        }

        [Theory]
        [MemberData(nameof(ParcelFilters))]
        [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "Not required for administrators.")]
        [SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not required for administrators.")]
        public void Get_Parcels_AsAdmin(ParcelFilter filter, int[] agencyIds, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.Get(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedCount, result.Count());
        }


        [Fact]
        public void Get_Parcels_AsAdmin_AllAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.Get(new ParcelFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(20, result.Count());
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
        public void Get_Page(ParcelFilter filter, int[] agencyIds, int expectedTotal)
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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedTotal, result.Total);
        }

        [Fact]
        public void Get_Page_OnlyAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(3);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.GetPage(new ParcelFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(1, result.Total);
        }

        [Theory]
        [MemberData(nameof(ParcelFilters))]
        [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "Not required for administrators.")]
        [SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not required for administrators.")]
        public void Get_Page_AsAdmin(ParcelFilter filter, int[] agencyIds, int expectedTotal)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(expectedTotal, result.Total);
        }

        [Fact]
        public void Get_Page_AsAdmin_AllAgencies()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

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
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.GetPage(new ParcelFilter());

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Parcel>>(result);
            Assert.Equal(20, result.Total);
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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(parcel, result, new ShallowPropertyCompare());
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address.AdministrativeArea);
            Assert.NotNull(parcel.Address.Province);
            Assert.NotNull(parcel.Classification);
            Assert.NotNull(parcel.Agency);
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Evaluations);
            Assert.NotNull(parcel.Fiscals);
            Assert.NotNull(parcel.Buildings);
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Get_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);
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
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address.AdministrativeArea);
            Assert.NotNull(parcel.Address.Province);
            Assert.NotNull(parcel.Classification);
            Assert.NotNull(parcel.Agency);
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Address);
            Assert.NotNull(parcel.Evaluations);
            Assert.NotNull(parcel.Fiscals);
            Assert.NotNull(parcel.Buildings);
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
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1, 1, 1);
            init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            init.SaveChanges();

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
            Assert.False(result.Buildings.First().Building.IsSensitive);
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
            init.CreateBuilding(parcel, 2);
            var building1 = init.CreateBuilding(parcel, 3);
            building1.IsSensitive = true;
            var building2 = init.CreateBuilding(parcel, 4, "13", "l4", 1, 1, init.Agencies.Find(2));
            building2.IsSensitive = true;
            init.SaveChanges();

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
            Assert.Equal(1, result.Buildings.Count(b => b.Building.IsSensitive));
        }

        /// <summary>
        /// Sensitive parcel found.
        /// </summary>
        [Fact]
        public void Get_Sensitive_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminProperties, Permissions.PropertyView);
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

        #region Add Parcel
        [Fact]
        public void Add_Parcel_NoPermission_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var init = helper.InitializeDatabase(user);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);

            var service = helper.CreateService<ParcelService>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Add(parcel));
        }

        [Fact]
        public void Add_Parcel_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);

            var service = helper.CreateService<ParcelService>();

            // Act
            parcel.Description = "a new description.";

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Add(parcel));
        }

        [Fact]
        public void Add_Parcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);
            parcel.Description = "a new description.";

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.Description.Should().Be("a new description.");
        }


        [Fact]
        public void Add_ParcelFinancials()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            parcel.Evaluations.Add(new Entity.ParcelEvaluation(parcel, DateTime.Now, Entity.EvaluationKeys.Assessed, 1000));
            parcel.Fiscals.Add(new Entity.ParcelFiscal(parcel, 2021, Entity.FiscalKeys.Market, 1000));
            parcel.Fiscals.Add(new Entity.ParcelFiscal(parcel, 2021, Entity.FiscalKeys.NetBook, 2000));
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(result.Evaluations, e => e.Key == Entity.EvaluationKeys.Assessed && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.Market && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.NetBook && e.Value == 2000);
        }

        [Fact]
        public void Add_Parcel_AddAgencyAsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);
            parcel.Agency = null;
            parcel.AgencyId = 2;

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.AgencyId.Should().Be(2);
        }

        [Fact]
        public void Add_Parcel_LinkedToProject()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(1);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            // Assert, parcels linked to projects can now be updated as multiple associations are allowed.
            service.Add(parcel);
        }

        [Fact]
        public void Add_Subdivision_ParcelAndSubdivisionError()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.CreateParcel(1);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            var subdivision = new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 2 };
            parcel.Parcels.Add(subdivision);
            parcel.Subdivisions.Add(subdivision);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Assert
            Assert.Throws<InvalidOperationException>(() =>
                service.Add(parcel));
        }

        [Fact]
        public void Add_Subdivision_Parcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            var subdivision = new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 2, Parcel = originalParcel };
            parcel.Parcels.Add(subdivision);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.Parcels.FirstOrDefault().Should().Be(subdivision);
            result.Subdivisions.Should().BeEmpty();
        }

        [Fact]
        public void Add_Parcel_Subdivision()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.CreateParcel(1);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            var dividedParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1 };
            parcel.Subdivisions.Add(dividedParcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.Subdivisions.FirstOrDefault().Should().Be(dividedParcel);
            result.Parcels.Should().BeEmpty();
        }

        [Fact]
        public void Add_Subdivision_UniquePin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            parcel.PID = 1; //set to the same pid as the existing parcel
            var dividedParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = originalParcel };
            parcel.Parcels.Add(dividedParcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.PIN.Should().Be(1);
        }

        [Fact]
        public void Add_Subdivision_UniqueIncrementedPin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            originalParcel.PIN = 1;
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            parcel.PID = 1; //set to the same pid as the existing parcel
            var dividedParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = originalParcel };
            parcel.Parcels.Add(dividedParcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.PIN.Should().Be(2);
        }

        [Fact]
        public void Add_Subdivision_TestPidReplacement()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            originalParcel.PIN = 1;
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            var dividedParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = originalParcel };
            parcel.Parcels.Add(dividedParcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var result = service.Add(parcel);

            // Assert
            Assert.NotNull(result);
            result.PID.Should().Be(1);
        }
        #endregion

        #region Update Parcel
        [Fact]
        public void Update_Parcel_NoPermission_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_Parcel_NotFound_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var searchParcel = EntityHelper.CreateParcel(2);
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>();

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Update(searchParcel));
        }

        [Fact]
        public void Update_Parcel_WrongAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>();

            // Act
            parcel.Description = "a new description.";

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_Parcel_InProject_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();
            parcel.ProjectNumbers = "[SPP-10000]";
            init.Update(parcel);
            init.SaveChanges();


            var service = helper.CreateService<ParcelService>();

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_Parcel_ChangeAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var service = helper.CreateService<ParcelService>();

            // Act
            parcel.AgencyId = 5;

            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_Parcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            parcel.Description = "a new description.";
            var result = service.Update(parcel);

            // Assert
            Assert.NotNull(result);
            result.Description.Should().Be("a new description.");
        }

        [Fact]
        public void Update_ParcelFinancials()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            parcel.Evaluations.Add(new Entity.ParcelEvaluation(parcel, DateTime.Now, Entity.EvaluationKeys.Assessed, 1000));
            parcel.Fiscals.Add(new Entity.ParcelFiscal(parcel, 2021, Entity.FiscalKeys.Market, 1000));
            parcel.Fiscals.Add(new Entity.ParcelFiscal(parcel, 2021, Entity.FiscalKeys.NetBook, 2000));
            var result = service.UpdateFinancials(parcel);

            // Assert
            Assert.NotNull(result);
            Assert.Contains(result.Evaluations, e => e.Key == Entity.EvaluationKeys.Assessed && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.Market && e.Value == 1000);
            Assert.Contains(result.Fiscals, e => e.Key == Entity.FiscalKeys.NetBook && e.Value == 2000);
        }

        [Fact]
        public void Update_Parcel_UpdateAgencyAsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            parcel.AgencyId = 2;
            var result = service.Update(parcel);

            // Assert
            Assert.NotNull(result);
            result.AgencyId.Should().Be(2);
        }

        [Fact]
        public void Update_Parcel_LinkedToProject_NotAllowed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            // Assert, parcels linked to projects cannot be updated
            Assert.Throws<NotAuthorizedException>(() =>
                service.Update(parcel));
        }

        [Fact]
        public void Update_Parcel_ParcelAndSubdivisionError()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.CreateParcel(1);
            init.CreateParcel(2);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var parcelToUpdate = service.Get(1);
            var divideParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1 };
            parcelToUpdate.Parcels.Add(divideParcel);
            parcelToUpdate.Subdivisions.Add(divideParcel);

            // Assert
            Assert.Throws<InvalidOperationException>(() =>
                service.Update(parcelToUpdate));
        }

        [Fact]
        public void Update_Subdivision_Parcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            init.CreateParcel(2);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var parcelToUpdate = service.Get(1);
            var divideParcel = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = originalParcel };
            parcelToUpdate.Parcels.Add(divideParcel);
            var result = service.Update(parcelToUpdate);

            // Assert
            Assert.NotNull(result);
            result.Parcels.FirstOrDefault().ParcelId.Should().Be(2);
            result.Parcels.FirstOrDefault().SubdivisionId.Should().Be(1);
            result.Subdivisions.Should().BeEmpty();
        }

        [Fact]
        public void Update_Subdivision_Parcel_Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = EntityHelper.CreateParcel(1);

            var originalParcel = init.CreateParcel(2);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var subdivision = new Entity.ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = originalParcel };
            parcel.Parcels.Add(subdivision);
            service.Add(parcel);

            var parcelToUpdate = service.Get(1);
            parcelToUpdate.Parcels.Clear();
            var result = service.Update(parcelToUpdate);

            // Assert
            Assert.NotNull(result);
            result.Subdivisions.Should().BeEmpty();
            result.Parcels.Should().BeEmpty();
        }

        [Fact]
        public void Update_Parcel_Subdivision_Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyAdd, Permissions.PropertyEdit).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = EntityHelper.CreateParcel(1);

            init.CreateParcel(2);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            var subdivision = new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 2 };
            parcel.Subdivisions.Add(subdivision);
            service.Add(parcel);

            var parcelToUpdate = service.Get(1);
            parcelToUpdate.Subdivisions.Clear();
            var result = service.Update(parcelToUpdate);

            // Assert
            Assert.NotNull(result);
            result.Subdivisions.Should().BeEmpty();
            result.Parcels.Should().BeEmpty();
        }

        [Fact]
        public void Update_Subdivision_TestPidReplacement()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.PropertyEdit, Permissions.PropertyAdd).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var originalParcel = init.CreateParcel(1);
            var updatedParcel = init.CreateParcel(3);
            originalParcel.PIN = 1;
            init.SaveChanges();
            var parcel = EntityHelper.CreateParcel(2);
            var dividedParcel = new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 2, Parcel = originalParcel };
            parcel.Parcels.Add(dividedParcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);

            // Act
            service.Add(parcel);

            // Update the parcel to contain a new Parcel
            var parcelToUpdate = service.Get(2);
            parcelToUpdate.Parcels.Clear();
            dividedParcel = new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 3, Parcel = updatedParcel };
            parcelToUpdate.Parcels.Add(dividedParcel);
            var result = service.Update(parcelToUpdate);

            // Assert
            Assert.NotNull(result);
            result.PID.Should().Be(3);
        }

        #endregion

        #region Delete Parcel
        /// <summary>
        /// Parcel does not exist.
        /// </summary>
        [Fact]
        public void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete);
            var find = EntityHelper.CreateParcel(1);
            var parcel = EntityHelper.CreateParcel(2, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Remove(find));
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

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(parcel));
        }

        /// <summary>
        /// Building is in an active project
        /// </summary>
        [Fact]
        public void Remove_NotAuthorized_InProject()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.ProjectNumbers = "[SPP-10000]";
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(parcel));
        }

        /// <summary>
        /// User does not have 'sensitive-delete' claim.
        /// </summary>
        [Fact]
        public void Remove_Sensitive_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(parcel));
        }

        /// <summary>
        /// User does not have 'sensitive-delete' claim.
        /// </summary>
        [Fact]
        public void Remove_Sensitive_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete, Permissions.AdminProperties).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
        }

        /// <summary>
        /// User is attempting to view sensitive parcel from another agency.
        /// </summary>
        [Fact]
        public void Remove_WrongAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var service = helper.CreateService<ParcelService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(parcel));
        }

        /// <summary>
        /// User is attempting to view sensitive parcel from another agency.
        /// </summary>
        [Fact]
        public void Remove_WrongAgency_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete, Permissions.AdminProperties);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Remove_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete, Permissions.SensitiveView).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.IsSensitive = true;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete).AddAgency(1);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(parcel);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(parcel).State);
        }

        /// <summary>
        /// Parcel found.
        /// </summary>
        [Fact]
        public void Remove_Parent_And_Subdivisions()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete, Permissions.PropertyAdd, Permissions.PropertyView).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            var parcel = init.CreateParcel(1);
            var subdivision = EntityHelper.CreateParcel(2);
            parcel.Subdivisions.Add(new Entity.ParcelParcel() { ParcelId = 1, SubdivisionId = 2, Subdivision = subdivision });

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ParcelService>(user, options);
            var context = helper.GetService<PimsContext>();
            service.Add(parcel);

            // Act
            service.Remove(parcel);
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get(2));
        }
        #endregion

        #region Check PID available

        /// <summary>
        /// Pid is Available for use.
        /// </summary>
        [Fact]
        public void IsPidAvailable_UsedByCurrentParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);
            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.IsPidAvailable(parcel.Id, 1);

            // Assert
            Assert.True(result);
        }

        /// <summary>
        /// Pid is not Available for use.
        /// </summary>
        [Fact]
        public void IsPidAvailable_UsedAnotherParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);
            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.IsPidAvailable(10, 1);

            // Assert
            Assert.False(result);
        }
        #endregion

        #region Check PIN available

        /// <summary>
        /// Pin is Available for use.
        /// </summary>
        [Fact]
        public void IsPinAvailable_UsedByCurrentParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.PIN = 1;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);
            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.IsPinAvailable(parcel.Id, 1);

            // Assert
            Assert.True(result);
        }

        /// <summary>
        /// Pin is not Available for use.
        /// </summary>
        [Fact]
        public void IsPinAvailable_UsedAnotherParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.PIN = 1;
            helper.CreatePimsContext(user, true).AddAndSaveChanges(parcel);
            var service = helper.CreateService<ParcelService>(user);

            // Act
            var result = service.IsPinAvailable(10, 1);

            // Assert
            Assert.False(result);
        }
        #endregion
        #endregion
    }
}
