using Microsoft.EntityFrameworkCore;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Helpers;
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
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class ProjectServiceTest
    {
        #region Data
        public static IEnumerable<object[]> ProjectFilters =>
            new List<object[]>
            {
                new object[] { new ProjectFilter() { ProjectNumber = "ProjectNumber" }, 1 },
                new object[] { new ProjectFilter() { Name = "Name" }, 1 },
                new object[] { new ProjectFilter() { Agencies = new int[] { 3 } }, 1 },
                new object[] { new ProjectFilter() { TierLevelId = 2 }, 1 },
                new object[] { new ProjectFilter() { StatusId = 1 }, 1 }
            };

        public static IEnumerable<object[]> Workflows =>
            new List<object[]>
            {
                new object[] { "SubmitDisposal", 6 },
                new object[] { "ReviewDisposal", 1 }
            };
        #endregion

        #region Constructors
        public ProjectServiceTest() { }
        #endregion

        #region Tests
        #region GetWorkflow
        [Theory]
        [MemberData(nameof(Workflows))]
        public void GetWorkflow(string workflow, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            
            var init = helper.CreatePimsContext(user, true);
            var status = EntityHelper.CreateProjectStatuses();
            init.SaveRange(status);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            var result = service.GetWorkflow(workflow);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.ProjectStatus>>(result);
            Assert.Equal(expectedCount, result.Count());
        }
        #endregion

        #region GetPage
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void GetPage_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() =>
                service.GetPage(null));
        }

        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void GetPage_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var filter = new ProjectFilter();

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.GetPage(filter));
        }

        [Theory]
        [MemberData(nameof(ProjectFilters))]
        public void GetPage(ProjectFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);

            using var init = helper.InitializeDatabase(user);
            var projects = init.CreateProjects(1, 20);
            projects.Next(0).Name = "-Name-";
            projects.Next(1).Agency = init.Agencies.Find(3);
            projects.Next(1).AgencyId = 3;
            projects.Next(2).TierLevel = init.TierLevels.Find(2);
            projects.Next(2).TierLevelId = 2;
            projects.Next(3).Description = "-Description-";
            projects.Next(4).Status = init.ProjectStatus.Find(1);
            projects.Next(4).StatusId = 1;
            projects.Next(5).ProjectNumber = "-ProjectNumber-";
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Project>>(result);
            Assert.Equal(expectedCount, result.Total);
        }

        [Theory]
        [MemberData(nameof(ProjectFilters))]
        public void GetPage_AsAdmin(ProjectFilter filter, int expectedCount)
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);

            using var init = helper.InitializeDatabase(user);
            var projects = init.CreateProjects(1, 20);
            projects.Next(0).Name = "-Name-";
            projects.Next(1).Agency = init.Agencies.Find(3);
            projects.Next(1).AgencyId = 3;
            projects.Next(2).TierLevel = init.TierLevels.Find(2);
            projects.Next(2).TierLevelId = 2;
            projects.Next(3).Description = "-Description-";
            projects.Next(4).Status = init.ProjectStatus.Find(1);
            projects.Next(4).StatusId = 1;
            projects.Next(5).ProjectNumber = "-ProjectNumber-";
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            // Act
            var result = service.GetPage(filter);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<Entity.Project>>(result);
            Assert.Equal(expectedCount, result.Total);
        }
        #endregion

        #region Get Project
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void Get_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Get($"SPP-{1:00000}"));
        }

        /// <summary>
        /// Project does not exist.
        /// </summary>
        [Fact]
        public void Get_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get($"SPP-{2:00000}"));
        }

        /// <summary>
        /// User is attempting to view sensitive project from another agency.
        /// </summary>
        [Fact]
        public void Get_WrongAgency_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                service.Get($"SPP-{1:00000}"));
        }

        /// <summary>
        /// Project found.
        /// </summary>
        [Fact]
        public void Get()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);
            
            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
            Assert.NotNull(project.ProjectNumber);
            Assert.NotNull(project.Name);
            Assert.NotNull(project.Agency);
            Assert.NotNull(project.Status);
            Assert.NotNull(project.TierLevel);
        }

        /// <summary>
        /// Project found.
        /// </summary>
        [Fact]
        public void Get_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.AdminProperties);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
        }

        /// <summary>
        /// Project found, but user does not have 'sensitive-view' claim.
        /// Remove sensitive buildings.
        /// </summary>
        [Fact]
        public void Get_RemoveSensitiveBuildings()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            project.AddProperty(parcel).AddProperty(building, sensitive);
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
            Assert.Equal(2, result.Properties.Count());
            Assert.DoesNotContain(result.Properties, p => p.Building?.IsSensitive ?? false);
        }

        /// <summary>
        /// Sensitive project found.
        /// </summary>
        [Fact]
        public void Get_Sensitive()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView, Permissions.SensitiveView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            project.AddProperty(parcel).AddProperty(building, sensitive);
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
            Assert.Equal(3, result.Properties.Count());
            Assert.Contains(result.Properties, p => p.Building?.IsSensitive ?? false);
        }

        /// <summary>
        /// Sensitive project found.
        /// </summary>
        [Fact]
        public void Get_Sensitive_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminProperties, Permissions.PropertyView, Permissions.SensitiveView);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            project.AddProperty(parcel).AddProperty(building, sensitive);
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
            Assert.Equal(3, result.Properties.Count());
            Assert.Contains(result.Properties, p => p.Building?.IsSensitive ?? false);
        }
        #endregion

        #region Add
        #endregion

        #region Update
        #endregion

        #region Remove
        /// <summary>
        /// Project does not exist.
        /// </summary>
        [Fact]
        public void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete);
            var find = EntityHelper.CreateProject(1);
            var project = EntityHelper.CreateProject(2);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

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
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(project));
        }

        /// <summary>
        /// User is attempting to view sensitive project from another agency.
        /// </summary>
        [Fact]
        public void Remove_WrongAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                service.Remove(project));
        }

        /// <summary>
        /// User is attempting to view sensitive project from another agency.
        /// </summary>
        [Fact]
        public void Remove_WrongAgency_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete, Permissions.AdminProperties);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(project);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(project).State);
        }

        /// <summary>
        /// Project found.
        /// </summary>
        [Fact]
        public void Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyDelete).AddAgency(1);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).SaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            service.Remove(project);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(project).State);
        }
        #endregion
        #endregion
    }
}
