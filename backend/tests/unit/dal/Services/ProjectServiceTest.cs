using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
                new object[] { new ProjectFilter() { StatusId = 2 }, 1 }
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
        #region GetPage
        /// <summary>
        /// User does not have 'property-view' claim.
        /// </summary>
        [Fact]
        public void GetPage_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);
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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView).AddAgency(1, 3);

            using var init = helper.InitializeDatabase(user);
            var projects = init.CreateProjects(1, 20);
            projects.Next(0).Name = "-Name-";
            projects.Next(1).Agency = init.Agencies.Find(3);
            projects.Next(1).AgencyId = 3;
            projects.Next(2).TierLevel = init.TierLevels.Find(2);
            projects.Next(2).TierLevelId = 2;
            projects.Next(3).Description = "-Description-";
            projects.Next(4).Status = init.ProjectStatus.Find(2);
            projects.Next(4).StatusId = 2;
            projects.Next(5).ProjectNumber = "-ProjectNumber-";
            init.SaveChanges();

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.AdminProjects);

            using var init = helper.InitializeDatabase(user);
            var projects = init.CreateProjects(1, 20);
            projects.Next(0).Name = "-Name-";
            projects.Next(1).Agency = init.Agencies.Find(3);
            projects.Next(1).AgencyId = 3;
            projects.Next(2).TierLevel = init.TierLevels.Find(2);
            projects.Next(2).TierLevelId = 2;
            projects.Next(3).Description = "-Description-";
            projects.Next(4).Status = init.ProjectStatus.Find(2);
            projects.Next(4).StatusId = 2;
            projects.Next(5).ProjectNumber = "-ProjectNumber-";
            init.SaveChanges();

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.SensitiveView);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView).AddAgency(1);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.AdminProjects);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            project.AddProperty(parcel);
            project.AddProperty(building, sensitive);
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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.SensitiveView).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            project.AddProperty(parcel);
            project.AddProperty(building, sensitive);
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
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminProjects, Permissions.ProjectView, Permissions.SensitiveView);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            var sensitive = init.CreateBuilding(parcel, 3);
            sensitive.IsSensitive = true;
            init.SaveChanges();
            project.AddProperty(parcel);
            project.AddProperty(building, sensitive);
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
        /// <summary>
        /// User with appropriate permission successfully adds new project. Project Number is auto-generated.
        /// </summary>
        [Fact]
        public void Add_Project()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);
            var project = EntityHelper.CreateProject(1);

            project.ProjectNumber = "test-generation-override";

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency).AddAndSaveChanges(project.Status);
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var result = service.Add(project);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.ProjectNumber);
            Assert.Matches($"TEST-{1:00000}", result.ProjectNumber);
        }

        [Fact]
        public void Add_DraftStatus()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency).AddAndSaveChanges(project.Status);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var result = service.Add(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
        }

        [Fact]
        public void Add_AddTasks()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);
            var init = helper.CreatePimsContext(user);
            var project = EntityHelper.CreateProject(1);
            init.AddAndSaveChanges(project.Agency).AddAndSaveChanges(project.Status);

            var tasks = EntityHelper.CreateDefaultTasks();
            var task = EntityHelper.CreateTask(20, "test tasks");
            init.AddAndSaveRange(tasks).AddAndSaveChanges(task);

            project.Status.Tasks.Add(new Entity.ProjectStatusTask(project.Status, task));
            init.UpdateAndSaveChanges(project.Status);

            project.Tasks.Add(new Entity.ProjectTask(project, task));

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var result = service.Add(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            Assert.Single(result.Tasks);
        }

        [Fact]
        public void Add_DefaultTasks()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);
            var init = helper.CreatePimsContext(user);
            var project = EntityHelper.CreateProject(1);

            init.AddAndSaveChanges(project.Agency).AddAndSaveChanges(project.Status);

            var tasks = EntityHelper.CreateDefaultTasks(project.Status);
            init.AddAndSaveRange(tasks);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var result = service.Add(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            Assert.Equal(tasks.Count(), result.Tasks.Count());
        }

        [Fact]
        public void Add_NoProject_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.Add(null));
        }

        [Fact]
        public void Add_Permission_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Add(project));
        }

        [Fact]
        public void Add_NoAgency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Add(project));
        }

        [Fact]
        public void Add_Agency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(2);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Add(project));
        }
        #endregion

        #region Update
        [Fact]
        public void Update()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.CreatePimsContext(user);
            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.Description = "A new description";
            var result = service.Update(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            result.Should().BeEquivalentTo(projectToUpdate, options => options.Excluding(o => o.SelectedMemberPath.Contains("Updated")));
            Assert.Equal("A new description", result.Description);
        }

        [Fact]
        public void Update_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.AdminProjects).AddAgency(1);

            var init = helper.CreatePimsContext(user);
            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.Description = "A new description";
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            projectToUpdate.Should().BeEquivalentTo(result, options => options.Excluding(x => x.SelectedMemberPath.Contains("Updated")));
            Assert.Equal("A new description", result.Description);
        }

        [Fact]
        public void Update_Task()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var task = init.CreateTask(20, "testing", project.Status);
            init.AddAndSaveChanges(task);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddTask(task);
            var result = service.Update(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            projectToUpdate.Should().BeEquivalentTo(result);
            Assert.Single(result.Tasks);
        }

        [Fact]
        public void Update_AddParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);

            init.AddAndSaveChanges(parcel);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(parcel);
            parcel.ProjectNumber = null;
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Properties);
            result.Should().BeEquivalentTo(projectToUpdate, options => options
            .IgnoringCyclicReferences()
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Parcel.Projects")
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Id")
            .Excluding(x => x.SelectedMemberPath.Contains("Created")));
            Assert.Equal(projectToUpdate.ProjectNumber, result.Properties.FirstOrDefault().Parcel.ProjectNumber);
            Assert.Equal(Entity.PropertyTypes.Land, result.Properties.First().PropertyType);
        }

        /**
         * Only financials and classifications will be updated by the service. Other updates should be ignored.
         */
        [Fact]
        public void Update_UpdateParcel_IgnoredField()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var updatedParcel = init.CreateParcel(2, project.Agency);
            project.AddProperty(parcel);
            init.AddAndSaveChanges(parcel);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            updatedParcel.Description = "updated";
            projectToUpdate.Properties.First().Parcel = updatedParcel;
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Properties);
            Assert.Equal(Entity.PropertyTypes.Land, result.Properties.First().PropertyType);
            Assert.Equal("description-1", result.Properties.First().Parcel.Description);
        }

        /**
         * Classification and financials are the only supported update fields
         */
        [Fact]
        public void Update_UpdateParcel_Supported()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var parcelEvaluation = init.CreateParcelEvaluation(parcel.Id);
            project.AddProperty(parcel);
            init.AddAndSaveChanges(parcel);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.Properties.First().Parcel.ClassificationId = 2;
            projectToUpdate.Properties.First().Parcel.Evaluations.Add(parcelEvaluation);
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Be(Entity.PropertyTypes.Land);
            result.Properties.First().Parcel.ClassificationId.Should().Be(2);
            result.Properties.First().Parcel.Evaluations.Should().HaveCount(2);
        }

        [Fact]
        public void Update_AddBuilding()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 20);
            init.AddAndSaveChanges(building);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(building);
            building.ProjectNumber = null;
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Should().BeEquivalentTo(projectToUpdate, options => options
            .IgnoringCyclicReferences()
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Building.Projects")
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Building.Parcel")
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Building.Agency.Parcels")
            .Excluding(x => x.SelectedMemberPath == "Properties[0].Id")
            .Excluding(x => x.SelectedMemberPath.Contains("Created")));
            Assert.Equal(projectToUpdate.ProjectNumber, result.Properties.FirstOrDefault().Building.ProjectNumber);
            result.Properties.First().PropertyType.Should().Be(Entity.PropertyTypes.Building);
        }

        /**
         * Only financials and classifications will be updated by the service. Other updates should be ignored.
         */
        [Fact]
        public void Update_UpdateBuilding_IgnoredField()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 20);
            var newBuilding = init.CreateBuilding(parcel, 21);
            project.AddProperty(building);
            init.AddAndSaveChanges(building);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            newBuilding.Description = "updated";
            projectToUpdate.Properties.First().Building = newBuilding;
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Equals(Entity.PropertyTypes.Building);
            result.Properties.First().Building.Description.Should().Equals("description-20");
        }

        /**
         * Classification and financials are the only supported update fields
         */
        [Fact]
        public void Update_UpdateBuilding_Supported()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 20);
            var newClassification = init.PropertyClassifications.Find(2);
            var parcelEvaluation = init.CreateBuildingEvaluation(building.Id);
            project.AddProperty(building);
            init.AddAndSaveChanges(building);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.Properties.First().Building.Classification = newClassification;
            projectToUpdate.Properties.First().Building.ClassificationId = 2;
            projectToUpdate.Properties.First().Building.Evaluations.Add(parcelEvaluation);
            service.Update(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Equals(Entity.PropertyTypes.Building);
            result.Properties.First().Building.ClassificationId.Should().Equals(2);
            result.Properties.First().Building.Evaluations.Should().HaveCount(2);
        }

        [Fact]
        public void Update_NoProject_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            Assert.Throws<ArgumentNullException>(() => service.Update(null));
        }

        [Fact]
        public void Update_Permission_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(project));
        }

        [Fact]
        public void Update_NoAgency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(project));
        }

        [Fact]
        public void Update_Agency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(2);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(project));
        }

        [Fact]
        public void Update_ChangeAgency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AgencyId = 2;

            // Assert
            Assert.Throws<NotAuthorizedException>(() => service.Update(projectToUpdate));
        }

        [Fact]
        public void Update_ProjectParcelAgencyMismatch_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var options = Options.Create(new ProjectOptions() { NumberFormat = "TEST-{0:00000}" });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            parcel.AgencyId = 2;
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(parcel);

            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(projectToUpdate));
        }

        [Fact]
        public void Update_ProjectBuildingAgencyMismatch_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var options = Options.Create(new ProjectOptions() { NumberFormat = "TEST-{0:00000}" });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            building.AgencyId = 2;
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(building);

            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(projectToUpdate));
        }

        [Fact]
        public void Update_ParcelInProject_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var newProject = init.CreateProject(2, project.Agency);
            var parcel = init.CreateParcel(1, project.Agency);
            parcel.ProjectNumber = project.ProjectNumber;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = Options.Create(new ProjectOptions() { NumberFormat = "TEST-{0:00000}" });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(newProject.ProjectNumber);
            projectToUpdate.AddProperty(parcel);

            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(projectToUpdate));
        }

        [Fact]
        public void Update_BuildingInProject_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var newProject = init.CreateProject(2, project.Agency);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 2, agency: project.Agency);
            building.ProjectNumber = project.ProjectNumber;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = Options.Create(new ProjectOptions() { NumberFormat = "TEST-{0:00000}" });
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(newProject.ProjectNumber);
            projectToUpdate.AddProperty(building);

            // Assert
            Assert.Throws<InvalidOperationException>(() => service.Update(projectToUpdate));
        }

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete);
            var find = EntityHelper.CreateProject(1);
            var project = EntityHelper.CreateProject(2);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete, Permissions.AdminProjects);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete).AddAgency(1);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user, true).AddAndSaveChanges(project);

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
