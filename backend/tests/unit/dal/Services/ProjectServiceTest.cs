using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
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
                new object[] { new ProjectFilter() { StatusId = new int[] { 2 } }, 1 }
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
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

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
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

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
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

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
            project.SubmittedOn = DateTime.UtcNow;
            project.ApprovedOn = DateTime.UtcNow;
            project.DeniedOn = DateTime.UtcNow;
            project.CancelledOn = DateTime.UtcNow;
            var metadata = new DisposalProjectMetadata()
            {
                InitialNotificationSentOn = DateTime.UtcNow,
                ThirtyDayNotificationSentOn = DateTime.UtcNow,
                SixtyDayNotificationSentOn = DateTime.UtcNow,
                NinetyDayNotificationSentOn = DateTime.UtcNow,
                OnHoldNotificationSentOn = DateTime.UtcNow,
                ClearanceNotificationSentOn = DateTime.UtcNow,
                TransferredWithinGreOn = DateTime.UtcNow,
            };
            project.Metadata = JsonSerializer.Serialize(metadata);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);
            var context = helper.GetService<PimsContext>();

            // Act
            var result = service.Get($"SPP-{1:00000}");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(EntityState.Detached, context.Entry(result).State);
            Assert.Equal(project, result, new ShallowPropertyCompare());
            Assert.NotNull(project.ProjectNumber);
            Assert.NotNull(project.GetNote(NoteTypes.Private));
            Assert.NotNull(project.GetNote(NoteTypes.Public));
            Assert.NotNull(project.SubmittedOn);
            Assert.NotNull(project.ApprovedOn);
            Assert.NotNull(project.DeniedOn);
            Assert.NotNull(project.CancelledOn);
            Assert.NotNull(project.Name);
            Assert.NotNull(project.Agency);
            Assert.NotNull(project.Status);
            Assert.NotNull(project.TierLevel);
            var resultMetadata = JsonSerializer.Deserialize<DisposalProjectMetadata>(project.Metadata);
            Assert.NotNull(resultMetadata.InitialNotificationSentOn);
            Assert.NotNull(resultMetadata.ThirtyDayNotificationSentOn);
            Assert.NotNull(resultMetadata.SixtyDayNotificationSentOn);
            Assert.NotNull(resultMetadata.NinetyDayNotificationSentOn);
            Assert.NotNull(resultMetadata.OnHoldNotificationSentOn);
            Assert.NotNull(resultMetadata.ClearanceNotificationSentOn);
            Assert.NotNull(resultMetadata.TransferredWithinGreOn);
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
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

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
        public async void Add_Project()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var project = EntityHelper.CreateProject(1, agency, tier, status);
            project.ProjectNumber = "test-generation-override";

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.ProjectNumber);
            Assert.Matches($"TEST-{1:00000}", result.ProjectNumber);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()), Times.Once());
        }

        /// <summary>
        /// User cannot add project to an agency that they do not belong to.
        /// </summary>
        [Fact]
        public async void AddProject_NotInAgency()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            var agency = init.Agencies.Add(new Agency("CODE2", "Min Code 2")).Entity;
            init.SaveChanges();
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var project = EntityHelper.CreateProject(1, agency, tier, status);
            project.AgencyId = agency.Id;
            project.ProjectNumber = "test-generation-override";

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.AddAsync(project));
        }

        [Fact]
        public async void Add_Financials()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));
            project.NetBook = 5;
            project.Assessed = 5;
            project.Market = 5;

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.Project>(result);
            project.Market.Should().Be(5);
            project.NetBook.Should().Be(5);
            project.Assessed.Should().Be(5);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()), Times.Once());
        }

        [Fact]
        public async void Add_Project_SimpleFields()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var risk = init.ProjectRisks.Find(1);
            var project = EntityHelper.CreateProject(1, agency, tier, status, risk);
            project.ProjectNumber = "test-generation-override";
            project.AddOrUpdateNote(NoteTypes.Private, "private note");
            project.AddOrUpdateNote(NoteTypes.Public, "public note");
            project.AddOrUpdateNote(NoteTypes.Exemption, "Providing reasoning for exemption request");
            var metadata = new DisposalProjectMetadata()
            {
                ExemptionRequested = true
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            project.SubmittedOn = DateTime.Now;
            project.DeniedOn = DateTime.Now.AddDays(1);
            project.ApprovedOn = DateTime.Now.AddDays(2);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { DraftFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            await service.AddAsync(project);
            var result = service.Get(project.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.ProjectNumber);
            Assert.Matches($"TEST-{1:00000}", result.ProjectNumber);
            Assert.Matches("private note", result.GetNote(NoteTypes.Private).Note);
            Assert.Matches("public note", result.GetNote(NoteTypes.Public).Note);
            Assert.Matches("Providing reasoning for exemption request", result.GetNote(NoteTypes.Exemption).Note);
            Assert.True(JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).ExemptionRequested);
            Assert.Equal(project.SubmittedOn, result.SubmittedOn);
            Assert.Equal(project.DeniedOn, result.DeniedOn);
            Assert.Equal(project.ApprovedOn, result.ApprovedOn);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()), Times.Once());
        }

        [Fact]
        public async void Add_DraftStatus()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var risk = init.ProjectRisks.Find(1);
            var project = EntityHelper.CreateProject(1, agency, tier, status, risk);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()), Times.Once());
        }

        [Fact]
        public async void Add_AddTasks()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var project = EntityHelper.CreateProject(1, agency, tier, status);

            var tasks = EntityHelper.CreateDefaultTasks();
            var task = EntityHelper.CreateTask(20, "test tasks");
            init.AddAndSaveRange(tasks).AddAndSaveChanges(task);

            project.Status.Tasks.Add(task);
            init.UpdateAndSaveChanges(project.Status);

            project.Tasks.Add(new Entity.ProjectTask(project, task));

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            Assert.Single(result.Tasks);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Add_DefaultTasks()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var project = EntityHelper.CreateProject(1, agency, tier, status);

            var tasks = EntityHelper.CreateDefaultTasks(project.Status);
            init.AddAndSaveRange(tasks);

            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            Assert.Equal(tasks.Count(), result.Tasks.Count());
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Add_DefaultResponses()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var agency = init.Agencies.Find(1);
            var tier = init.TierLevels.Find(1);
            var status = init.Workflows.Find(1).Status.First();
            var project = EntityHelper.CreateProject(1, agency, tier, status);

            var response = EntityHelper.CreateResponse(project.Id, project.AgencyId);
            project.Responses.Add(response);


            var options = Options.Create(new PimsOptions() { Project = new ProjectOptions() { NumberFormat = "TEST-{0:00000}" } });
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var result = await service.AddAsync(project);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(project, result);
            Assert.Equal(1, result.StatusId);
            result.Responses.Should().BeEquivalentTo(new List<ProjectAgencyResponse>() { response });
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Once());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Add_NoProject_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectAdd);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.AddAsync(null));
        }

        [Fact]
        public async void Add_Permission_Throws_NotAuthorized()
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
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.AddAsync(project));
        }

        [Fact]
        public async void Add_NoAgency_Throws_NotAuthorized()
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
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.AddAsync(project));
        }

        [Fact]
        public async void Add_Agency_Throws_NotAuthorized()
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
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.AddAsync(project));
        }
        #endregion

        #region Update
        [Fact]
        public async void Update()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.Description = "A new description";
            var result = await service.UpdateAsync(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("A new description", result.Description);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_Notes()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            var projectNote = new ProjectNote()
            {
                Note = "test note",
                NoteType = NoteTypes.LoanTerms,
            };
            projectToUpdate.Notes.Add(projectNote);
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(projectToUpdate.Id);

            // Assert
            Assert.NotNull(result);
            result.Notes.Should().Contain(projectNote);
            queueService.Verify(m => m.NotificationQueue.GenerateNotification(It.IsAny<Entity.Project>(), "Project Shared Note Changed"), Times.Never());
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_SharedNote()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var template = init.CreateNotificationTemplate(1, "Project Shared Note Changed");
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotification(It.IsAny<Entity.Project>(), It.IsAny<string>())).Returns(new NotificationQueue(template, "test@test.com", template.Subject, template.Body));
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.AddOrUpdateNote(NoteTypes.Public, "changed value");
            var result = await service.UpdateAsync(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            result.GetNote(NoteTypes.Public).Note.Should().Be(project.GetNote(NoteTypes.Public).Note);
            queueService.Verify(m => m.NotificationQueue.GenerateNotification(It.IsAny<Entity.Project>(), "Project Shared Note Changed"), Times.Once());
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_Financials()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            project.ReportedFiscalYear = 2020;
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));
            project.Market = 15;
            project.Assessed = 15;
            project.NetBook = 15;
            // Act
            var projectToUpdate = service.Get(project.Id);
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(projectToUpdate.Id);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<Entity.Project>(result);
            project.Market.Should().Be(15);
            project.NetBook.Should().Be(15);
            project.Assessed.Should().Be(15);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_SimpleFields()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.Description = "A new description";
            projectToUpdate.AddOrUpdateNote(NoteTypes.Private, "private Note");
            projectToUpdate.AddOrUpdateNote(NoteTypes.Public, "public Note");
            projectToUpdate.SubmittedOn = new DateTime();
            projectToUpdate.ApprovedOn = new DateTime().AddDays(1);
            projectToUpdate.DeniedOn = new DateTime().AddDays(2);

            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(projectToUpdate.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("A new description", result.Description);
            Assert.Equal("private Note", result.GetNote(NoteTypes.Private).Note);
            Assert.Equal("public Note", result.GetNote(NoteTypes.Public).Note);
            Assert.Equal(projectToUpdate.SubmittedOn, result.SubmittedOn);
            Assert.Equal(projectToUpdate.ApprovedOn, result.ApprovedOn);
            Assert.Equal(projectToUpdate.DeniedOn, result.DeniedOn);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.AdminProjects).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.Description = "A new description";
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("A new description", result.Description);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_Task()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var task = init.CreateTask(20, "testing", project.Status);
            init.AddAndSaveChanges(task);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.AddTask(task);
            var result = await service.UpdateAsync(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Tasks);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_AddParcel()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);

            init.AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.AddProperty(parcel);
            parcel.ProjectNumbers = null;
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Properties);
            Assert.Contains(projectToUpdate.ProjectNumber, result.Properties.FirstOrDefault().Parcel.ProjectNumbers);
            Assert.Equal(Entity.PropertyTypes.Land, result.Properties.First().PropertyType);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_Response()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var response = init.CreateResponse(project.Id, project.AgencyId);
            init.AddAndSaveChanges(response);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            var result = await service.UpdateAsync(projectToUpdate);

            // Assert
            Assert.NotNull(result);
            result.Responses.Should().HaveCount(1);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        /**
         * Only financials and classifications will be updated by the service. Other updates should be ignored.
         */
        [Fact]
        public async void Update_UpdateParcel_IgnoredField()
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

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            updatedParcel.Description = "updated";
            projectToUpdate.Properties.First().Parcel = updatedParcel;
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result.Properties);
            Assert.Equal(Entity.PropertyTypes.Land, result.Properties.First().PropertyType);
            Assert.Equal("description-1", result.Properties.First().Parcel.Description);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        /**
         * Classification and financials are the only supported update fields
         */
        [Fact]
        public async void Update_UpdateParcel_Supported()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var parcelEvaluation = init.CreateEvaluation(parcel, DateTime.UtcNow);
            project.AddProperty(parcel);
            init.AddAndSaveChanges(parcel);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            var parcelToUpdate = EntityHelper.CreateParcel(1);
            var parcelEvaluationToUpdate = EntityHelper.CreateEvaluation(parcelToUpdate, DateTime.UtcNow);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.AddProperty(parcelToUpdate);
            projectToUpdate.Properties.First().Id = project.Properties.First().Id;
            projectToUpdate.Properties.First().Parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            projectToUpdate.Properties.First().Parcel.Evaluations.Add(parcelEvaluationToUpdate);
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Be(Entity.PropertyTypes.Land);
            result.Properties.First().Parcel.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            result.Properties.First().Parcel.Evaluations.Should().HaveCount(2);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_AddBuilding()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 20);
            init.AddAndSaveChanges(building);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.ProjectNumber = project.ProjectNumber;
            projectToUpdate.AddProperty(building);
            building.ProjectNumbers = null;
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            Assert.Contains(projectToUpdate.ProjectNumber, result.Properties.FirstOrDefault().Building.ProjectNumbers);
            result.Properties.First().PropertyType.Should().Be(Entity.PropertyTypes.Building);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        /**
         * Only financials and classifications will be updated by the service. Other updates should be ignored.
         */
        [Fact]
        public async void Update_UpdateBuilding_IgnoredField()
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

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            newBuilding.Description = "updated";
            projectToUpdate.Properties.First().Building = newBuilding;
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Equals(Entity.PropertyTypes.Building);
            result.Properties.First().Building.Description.Should().Equals("description-20");
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        /**
         * Classification and financials are the only supported update fields
         */
        [Fact]
        public async void Update_UpdateBuilding_Supported()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 20);
            var newClassification = init.PropertyClassifications.Find(2);
            var parcelEvaluation = init.CreateEvaluation(building, DateTime.UtcNow);
            project.AddProperty(building);
            init.AddAndSaveChanges(building);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.Properties.First().Building.Classification = newClassification;
            projectToUpdate.Properties.First().Building.ClassificationId = (int)ClassificationTypes.SurplusActive;
            projectToUpdate.Properties.First().Building.Evaluations.Add(parcelEvaluation);
            await service.UpdateAsync(projectToUpdate);
            var result = service.Get(project.ProjectNumber);

            // Assert
            Assert.NotNull(result);
            result.Properties.Should().HaveCount(1);
            result.Properties.First().PropertyType.Should().Equals(Entity.PropertyTypes.Building);
            result.Properties.First().Building.ClassificationId.Should().Equals((int)ClassificationTypes.SurplusActive);
            result.Properties.First().Building.Evaluations.Should().HaveCount(2);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void Update_NoProject_Throws_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.UpdateAsync(null));
        }

        [Fact]
        public async void Update_Permission_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project.Agency);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.UpdateAsync(project));
        }

        [Fact]
        public async void Update_NoAgency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.UpdateAsync(project));
        }

        [Fact]
        public async void Update_Agency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(2);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.UpdateAsync(project));
        }

        [Fact]
        public async void Update_ChangeAgency_Throws_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);
            var project = EntityHelper.CreateProject(1);

            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AgencyId = 2;

            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.UpdateAsync(projectToUpdate));
        }

        [Fact]
        public async void Update_ProjectParcelAgencyMismatch_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            parcel.AgencyId = 2;
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(parcel);

            // Assert
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.UpdateAsync(projectToUpdate));
        }

        [Fact]
        public async void Update_ProjectBuildingAgencyMismatch_Throws_BusinessException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            using var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1);
            var parcel = init.CreateParcel(1);
            var building = init.CreateBuilding(parcel, 2);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            building.AgencyId = 2;
            var projectToUpdate = service.Get(project.ProjectNumber);
            projectToUpdate.AddProperty(building);

            // Assert
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.UpdateAsync(projectToUpdate));
        }

        [Fact]
        public async void Update_ParcelInProject_Allowed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var newProject = init.CreateProject(2, project.Agency);
            var parcel = init.CreateParcel(1, project.Agency);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(newProject.ProjectNumber);
            projectToUpdate.AddProperty(parcel);

            // Assert
            await service.UpdateAsync(projectToUpdate);
        }

        [Fact]
        public async void Update_BuildingInProject_Allowed()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyEdit, Permissions.PropertyView, Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var newProject = init.CreateProject(2, project.Agency);
            var parcel = init.CreateParcel(1, project.Agency);
            var building = init.CreateBuilding(parcel, 2, agency: project.Agency);
            building.UpdateProjectNumbers(project.ProjectNumber);
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            options.Value.Project.NumberFormat = "TEST-{0:00000}";
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            var projectToUpdate = service.Get(newProject.ProjectNumber);
            projectToUpdate.AddProperty(building);

            // updating a building already in a project should not throw an exception.
            await service.UpdateAsync(projectToUpdate);
        }
        #endregion

        #region Remove
        /// <summary>
        /// Project does not exist.
        /// </summary>
        [Fact]
        public async void Remove_KeyNotFound()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete);
            var find = EntityHelper.CreateProject(1);
            var project = EntityHelper.CreateProject(2);
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await service.RemoveAsync(find));
        }

        /// <summary>
        /// User does not have 'property-delete' claim.
        /// </summary>
        [Fact]
        public async void Remove_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission();
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () =>
                await service.RemoveAsync(project));
        }

        /// <summary>
        /// User is attempting to view sensitive project from another agency.
        /// </summary>
        [Fact]
        public async void Remove_WrongAgency_NotAuthorized()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () =>
                await service.RemoveAsync(project));
        }

        /// <summary>
        /// User is attempting to view sensitive project from another agency.
        /// </summary>
        [Fact]
        public async void Remove_WrongAgency_AsAdmin()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete, Permissions.AdminProjects);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);
            var context = helper.GetService<PimsContext>();
            var notifyService = helper.GetService<Mock<INotificationService>>();
            notifyService.Setup(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()));

            // Act
            await service.RemoveAsync(project);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(project).State);
            notifyService.Verify(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()), Times.Once);
        }

        /// <summary>
        /// Project found.
        /// </summary>
        [Fact]
        public async void Remove_ActiveProject_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete).AddAgency(1);
            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);
            var context = helper.GetService<PimsContext>();

            // Act
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.RemoveAsync(project));
        }

        /// <summary>
        /// Project found.
        /// </summary>
        [Fact]
        public async void Remove()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectDelete).AddAgency(1);
            var project = EntityHelper.CreateProject(1);
            helper.CreatePimsContext(user).AddAndSaveChanges(project);

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);
            var context = helper.GetService<PimsContext>();
            var notifyService = helper.GetService<Mock<INotificationService>>();
            notifyService.Setup(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()));

            // Act
            await service.RemoveAsync(project);

            // Assert
            Assert.Equal(EntityState.Detached, context.Entry(project).State);
            notifyService.Verify(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()), Times.Once);

        }
        #endregion

        #region SetStatus
        [Fact]
        public async void SetStatus_WithCode_InvalidWorkflow_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var project = init.CreateProject(1, 1);

            var service = helper.CreateService<ProjectService>(user);

            var workflowCode = "code";

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await service.SetStatusAsync(project, workflowCode));
        }

        [Fact]
        public async void SetStatus_WithCode_InvalidStatus_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1, 1);
            init.SaveChanges();
            project.StatusId = 999;

            var service = helper.CreateService<ProjectService>(user);

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_WithCode_NullProject_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultProjectStatus();
            var workflows = init.CreateDefaultWorkflows();
            init.SaveChanges();
            init.AddStatusToWorkflow(workflows.First(), init.ProjectStatus.Where(s => s.Id <= 6)).SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var workflowCode = workflows.First().Code;
            var statusCode = init.ProjectStatus.Find(6).Id; // Submitted Status

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.SetStatusAsync(null, workflowCode));
        }

        [Fact]
        public async void SetStatus_NoProject_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflows();
            init.SaveChanges();
            init.AddStatusToWorkflow(workflows.First(), init.ProjectStatus.Where(s => s.Id <= 6)).SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var workflowCode = workflows.First().Code;

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.SetStatusAsync(null, workflowCode));
        }

        [Fact]
        public async void SetStatus_NoRowVersion_RowVersionMissingException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();
            project.RowVersion = null;

            var service = helper.CreateService<ProjectService>(user);

            var review = init.ProjectStatus.First(s => s.Code == "AS-D");
            project.StatusId = review.Id;

            // Act
            // Assert
            await Assert.ThrowsAsync<RowVersionMissingException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_NoPermission_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var review = init.ProjectStatus.First(s => s.Code == "AS-D");
            project.StatusId = review.Id;

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_NullWorkflow_ArgumentNullException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var review = init.ProjectStatus.First(s => s.Code == "AS-D");
            project.StatusId = review.Id;

            // Act
            // Assert
            await Assert.ThrowsAsync<ArgumentNullException>(async () => await service.SetStatusAsync(project, (Entity.Workflow)null));
        }

        [Fact]
        public async void SetStatus_InvalidProject_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var find = init.CreateProject(2, 1);
            find.StatusId = init.ProjectStatus.Find(6).Id; // Submitted Status

            // Act
            // Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await service.SetStatusAsync(find, find.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_WrongAgency_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(2);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var review = init.ProjectStatus.First(s => s.Code == "AS-D");
            project.StatusId = review.Id;

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_InvalidTransition_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-I");
            init.SaveChanges();

            var service = helper.CreateService<ProjectService>(user);

            var review = init.ProjectStatus.First(s => s.Code == "AS-AP");
            project.StatusId = review.Id;

            // Act
            // Assert
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_IncompleteTasks_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SaveChanges();
            var draft = init.ProjectStatus.First(s => s.Code == "DR");
            var addProperties = init.ProjectStatus.First(s => s.Code == "DR-P");
            var task = init.CreateTask(1, "Documentation", draft);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var workflowCode = workflows.First().Code;
            project.StatusId = addProperties.Id; // Deny Status

            // Act
            // Assert
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, workflowCode));
        }

        [Fact]
        public async void SetStatus_SharedNote()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();

            var project = init.CreateProject(1);
            var template = init.CreateNotificationTemplate(1, "Project Shared Note Changed");
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotification(It.IsAny<Entity.Project>(), It.IsAny<string>())).Returns(new NotificationQueue(template, "test@test.com", template.Subject, template.Body));
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var workflow = init.Workflows.FirstOrDefault(w => w.Code == "ASSESS-DISPOSAL");

            // Act
            var projectToUpdate = EntityHelper.CreateProject(1);
            projectToUpdate.AddOrUpdateNote(NoteTypes.Public, "changed value");
            var result = await service.SetStatusAsync(projectToUpdate, workflow);

            // Assert
            Assert.NotNull(result);
            result.GetNote(NoteTypes.Public).Note.Should().Be(project.GetNote(NoteTypes.Public).Note);
            queueService.Verify(m => m.NotificationQueue.GenerateNotification(It.IsAny<Entity.Project>(), "Project Shared Note Changed"), Times.Once());
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_Deny_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-FNC");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var deny = init.ProjectStatus.First(s => s.Code == "DE");
            project.StatusId = deny.Id; // Deny Status

            // Act
            project.AddOrUpdateNote(NoteTypes.Public, "this is the reason");
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(deny.Id);
            result.Status.Should().Be(deny);
            result.DeniedOn.Should().NotBeNull();
            parcel.ProjectNumbers.Should().NotContain(project.ProjectNumber);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_Cancel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);
            var notifyService = helper.GetService<Mock<INotificationService>>();
            notifyService.Setup(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()));

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var cancel = init.ProjectStatus.First(s => s.Code == "CA");
            project.StatusId = cancel.Id; // Cancel Status

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(cancel.Id);
            result.Status.Should().Be(cancel);
            result.CancelledOn.Should().NotBeNull();
            parcel.ProjectNumbers.Should().NotContain(project.ProjectNumber);
            notifyService.Verify(m => m.CancelAsync(It.IsAny<IEnumerable<Entity.NotificationQueue>>()), Times.Once);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_OnHold_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                OnHoldNotificationSentOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var onHold = init.ProjectStatus.First(s => s.Code == "ERP-OH");
            project.StatusId = onHold.Id; // On Hold Status

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(onHold.Id);
            result.Status.Should().Be(onHold);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).OnHoldNotificationSentOn.Should().NotBeNull();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_OnHold_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var onHold = init.ProjectStatus.First(s => s.Code == "ERP-OH");
            project.StatusId = onHold.Id; // On Hold Status

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_TransferredWithinGre_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                TransferredWithinGreOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var transferredWithinGre = init.ProjectStatus.First(s => s.Code == "T-GRE");
            project.StatusId = transferredWithinGre.Id; // Transferred within GRE Status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(transferredWithinGre.Id);
            result.Status.Should().Be(transferredWithinGre);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).TransferredWithinGreOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.ProjectNumbers.Should().Be("[]");
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_TransferredWithinGre_Success_Subdivisions()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            parcel.PropertyTypeId = (int)PropertyTypes.Subdivision;
            var parentParcel = init.CreateParcel(2);
            parcel.Parcels.Add(new ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = parentParcel });
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                TransferredWithinGreOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var transferredWithinGre = init.ProjectStatus.First(s => s.Code == "T-GRE");
            project.StatusId = transferredWithinGre.Id; // Transferred within GRE Status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(transferredWithinGre.Id);
            result.Status.Should().Be(transferredWithinGre);
            project.Properties.First().Parcel.PropertyTypeId.Should().Be((int)PropertyTypes.Land);
            parentParcel.ClassificationId.Should().Be((int)ClassificationTypes.Subdivided);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).TransferredWithinGreOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.ProjectNumbers.Should().Be("[]");
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_TransferredWithinGre_Success_SubdivisionsParentNotTransferred()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            parcel.PropertyTypeId = (int)PropertyTypes.Subdivision;
            var parentParcel = init.CreateParcel(2);
            parcel.Parcels.Add(new ParcelParcel() { ParcelId = 2, SubdivisionId = 1, Parcel = parentParcel });
            project.AddProperty(parcel);
            project.AddProperty(parentParcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                TransferredWithinGreOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var transferredWithinGre = init.ProjectStatus.First(s => s.Code == "T-GRE");
            project.StatusId = transferredWithinGre.Id; // Transferred within GRE Status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(transferredWithinGre.Id);
            result.Status.Should().Be(transferredWithinGre);
            var transferredSubdivision = result.Properties.FirstOrDefault(p => p.Parcel.AgencyId == 2).Parcel;
            var nonTransferredParent = result.Properties.FirstOrDefault(p => p.Parcel.AgencyId == 1).Parcel;
            parentParcel.ClassificationId.Should().Be((int)ClassificationTypes.Subdivided);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).TransferredWithinGreOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            transferredSubdivision.PropertyTypeId.Should().Be((int)PropertyTypes.Land);
            transferredSubdivision.ProjectNumbers.Should().Be("[]");
            transferredSubdivision.AgencyId.Should().Be(2);
            transferredSubdivision.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            nonTransferredParent.AgencyId.Should().Be(1);
            nonTransferredParent.ClassificationId.Should().Be((int)ClassificationTypes.Subdivided);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_TransferredWithinGre_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var transferredWithinGre = init.ProjectStatus.First(s => s.Code == "T-GRE");
            project.StatusId = transferredWithinGre.Id; // Transferred within GRE Status

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_ApprovedForSpl_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "AP-SPL");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow,
                RequestForSplReceivedOn = DateTime.UtcNow,
                ApprovedForSplOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var clearanceNotificationSentOn = init.ProjectStatus.First(s => s.Code == "AP-SPL");
            project.StatusId = clearanceNotificationSentOn.Id; // Approved for SPL status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(clearanceNotificationSentOn.Id);
            result.Status.Should().Be(clearanceNotificationSentOn);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).ClearanceNotificationSentOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_ApprovedForSpl_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "AP-SPL");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var transferredWithinGre = init.ProjectStatus.First(s => s.Code == "AP-SPL");
            project.StatusId = transferredWithinGre.Id; // Approved for SPL status.

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatusAsync_NotInSpl_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "AP-!SPL");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var clearanceNotificationSentOn = init.ProjectStatus.First(s => s.Code == "AP-!SPL");
            project.StatusId = clearanceNotificationSentOn.Id; // Not in SPL status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(clearanceNotificationSentOn.Id);
            result.Status.Should().Be(clearanceNotificationSentOn);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).ClearanceNotificationSentOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatusAsync_NotInSpl_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-ON");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var notInSpl = init.ProjectStatus.First(s => s.Code == "AP-!SPL");
            var updateProject = init.Projects.First();
            updateProject.StatusId = notInSpl.Id; // Not in SPL status.

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(updateProject, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatusAsync_PreMarketing_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "AP-!SPL");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var clearanceNotificationSentOn = init.ProjectStatus.First(s => s.Code == "AP-!SPL");
            project.StatusId = clearanceNotificationSentOn.Id; // Not in SPL status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(clearanceNotificationSentOn.Id);
            result.Status.Should().Be(clearanceNotificationSentOn);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).ClearanceNotificationSentOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatusAsync_Marketing_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "SPL-M");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                MarketedOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var marketed = init.ProjectStatus.First(s => s.Code == "SPL-M");
            project.StatusId = marketed.Id; // Marketed status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(marketed.Id);
            result.Status.Should().Be(marketed);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).MarketedOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatusAsync_Marketing_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "SPL-M");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var marketed = init.ProjectStatus.First(s => s.Code == "SPL-M");
            project.StatusId = marketed.Id; // Marketing status.

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatusAsync_ContractInPlace_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "SPL-CIP-C");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var contractInPlace = init.ProjectStatus.First(s => s.Code == "SPL-CIP-C");
            project.StatusId = contractInPlace.Id; // Contract in Place status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(contractInPlace.Id);
            result.Status.Should().Be(contractInPlace);
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().Be(2);
            property.ClassificationId.Should().Be((int)ClassificationTypes.SurplusActive);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatusAsync_Disposed_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "DIS");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            var metadata = new DisposalProjectMetadata()
            {
                DisposedOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var disposed = init.ProjectStatus.First(s => s.Code == "DIS");
            project.StatusId = disposed.Id; // Marketed status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(disposed.Id);
            result.Status.Should().Be(disposed);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).DisposedOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().BeNull();
            property.ClassificationId.Should().Be((int)ClassificationTypes.Disposed);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatusAsync_Disposed_Success_Subdivisions()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "DIS");
            var parcel = init.CreateParcel(1);
            var parentParcel = init.CreateParcel(2);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            parcel.Parcels.Add(new ParcelParcel() { ParcelId = parentParcel.Id, SubdivisionId = parcel.Id, Parcel = parentParcel });
            var metadata = new DisposalProjectMetadata()
            {
                DisposedOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var disposed = init.ProjectStatus.First(s => s.Code == "DIS");
            project.StatusId = disposed.Id; // Marketed status

            EntityHelper.CreateAgency(2);
            parcel.AgencyId = 2;
            EntityHelper.CreatePropertyClassification(2, "new classification");
            parcel.ClassificationId = (int)ClassificationTypes.SurplusActive;
            project.Properties.First().Parcel = parcel;

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(disposed.Id);
            result.Status.Should().Be(disposed);
            JsonSerializer.Deserialize<DisposalProjectMetadata>(result.Metadata).DisposedOn.Should().NotBeNull();
            var property = result.Properties.First().Parcel;
            property.AgencyId.Should().BeNull();
            property.ClassificationId.Should().Be((int)ClassificationTypes.Disposed);
            property.IsVisibleToOtherAgencies.Should().BeFalse();
            property.Parcels.Should().BeEmpty();
            property.PropertyTypeId.Should().Be((int)PropertyTypes.Land);
            parentParcel.ClassificationId.Should().Be((int)ClassificationTypes.Subdivided);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());

        }

        [Fact]
        public async void SetStatusAsync_Disposed_InvalidOperationException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.DisposeApprove, Permissions.AdminProjects, Permissions.ProjectView).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "SPL", "DIS");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var marketed = init.ProjectStatus.First(s => s.Code == "DIS");
            project.StatusId = marketed.Id; // Marketing status.

            // Act
            await Assert.ThrowsAsync<InvalidOperationException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_Submit_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            var erp = init.ProjectStatus.First(s => s.Code == "DR-RE");
            project.StatusId = erp.Id; // Review
            project.Status = erp;
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var submit = init.ProjectStatus.First(s => s.Code == "AS-I");
            project.StatusId = submit.Id; // Submit Status

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_Submit_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeRequest).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            var erp = init.ProjectStatus.First(s => s.Code == "DR-RE");
            project.StatusId = erp.Id; // Review
            project.Status = erp;
            project.ProjectNumber = "TEST";
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var submit = init.ProjectStatus.First(s => s.Code == "AS-I");
            project.StatusId = submit.Id; // Submit Status

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(submit.Id);
            result.Status.Should().Be(submit);
            result.DeniedOn.Should().BeNull();
            result.SubmittedOn.Should().NotBeNull();
            Assert.Contains(project.ProjectNumber, parcel.ProjectNumbers);
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_ApproveERP_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-FNC");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var approve = init.ProjectStatus.First(s => s.Code == "AP-ERP");
            project.StatusId = approve.Id; // Submit Status

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_ApproveERP_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeApprove).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-DISPOSAL", "AS-FNC");
            var parcel = init.CreateParcel(1);
            parcel.IsVisibleToOtherAgencies = false;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var approve = init.ProjectStatus.First(s => s.Code == "AP-ERP");
            project.StatusId = approve.Id; // Submit Status

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(approve.Id);
            result.Status.Should().Be(approve);
            result.DeniedOn.Should().BeNull();
            result.ApprovedOn.Should().NotBeNull();
            parcel.IsVisibleToOtherAgencies.Should().BeTrue();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_ApproveSPL_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-OH");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var approve = init.ProjectStatus.First(s => s.Code == "AP-SPL");
            project.StatusId = approve.Id; // Submit Status

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_ApproveSPL_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeApprove).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ERP", "ERP-OH");
            var parcel = init.CreateParcel(1);
            parcel.IsVisibleToOtherAgencies = true;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var approve = init.ProjectStatus.First(s => s.Code == "AP-SPL");
            project.StatusId = approve.Id; // Submit Status
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow,
                RequestForSplReceivedOn = DateTime.UtcNow,
                ApprovedForSplOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(approve.Id);
            result.Status.Should().Be(approve);
            result.DeniedOn.Should().BeNull();
            result.ApprovedOn.Should().NotBeNull();
            parcel.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_ApproveExemption_NotAuthorizedException()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectEdit).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-EXEMPTION", "AS-EXP");
            var parcel = init.CreateParcel(1);
            project.AddProperty(parcel);
            parcel.UpdateProjectNumbers(project.ProjectNumber);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var approve = init.ProjectStatus.First(s => s.Code == "AP-EXE");
            project.StatusId = approve.Id; // Submit Status

            // Act
            // Assert
            await Assert.ThrowsAsync<NotAuthorizedException>(async () => await service.SetStatusAsync(project, project.Workflow.Code));
        }

        [Fact]
        public async void SetStatus_ApproveExemption_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeApprove).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-EXEMPTION", "AS-EXP");
            var parcel = init.CreateParcel(1);
            parcel.IsVisibleToOtherAgencies = true;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var approve = init.ProjectStatus.First(s => s.Code == "AP-EXE");
            project.StatusId = approve.Id; // Submit Status
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow,
                ExemptionApprovedOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(approve.Id);
            result.Status.Should().Be(approve);
            result.DeniedOn.Should().BeNull();
            result.ApprovedOn.Should().NotBeNull();
            parcel.IsVisibleToOtherAgencies.Should().BeTrue();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_TransferredGreFromApprovedExemption_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeApprove).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-EX-DISPOSAL", "AP-EXE");
            var parcel = init.CreateParcel(1);
            parcel.IsVisibleToOtherAgencies = true;
            project.AddProperty(parcel);
            project.ApprovedOn = DateTime.UtcNow;
            var metadata = new DisposalProjectMetadata()
            {
                TransferredWithinGreOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var approve = init.ProjectStatus.First(s => s.Code == "T-GRE");
            project.StatusId = approve.Id; // Submit Status
            metadata.ClearanceNotificationSentOn = DateTime.UtcNow;
            project.Metadata = JsonSerializer.Serialize(metadata);

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(approve.Id);
            result.Status.Should().Be(approve);
            result.DeniedOn.Should().BeNull();
            result.ApprovedOn.Should().NotBeNull();
            parcel.IsVisibleToOtherAgencies.Should().BeTrue();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }

        [Fact]
        public async void SetStatus_ExemptionAddToSpl_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var user = PrincipalHelper.CreateForPermission(Permissions.ProjectView, Permissions.ProjectEdit, Permissions.DisposeApprove).AddAgency(1);

            var init = helper.InitializeDatabase(user);
            var workflows = init.CreateDefaultWorkflowsWithStatus();
            init.SaveChanges();
            var project = init.CreateProject(1, 1);
            init.SetStatus(project, "ASSESS-EXEMPTION", "AS-EXP");
            var parcel = init.CreateParcel(1);
            parcel.IsVisibleToOtherAgencies = true;
            project.AddProperty(parcel);
            init.SaveChanges();

            var options = ControllerHelper.CreateDefaultPimsOptions();
            var service = helper.CreateService<ProjectService>(user, options);

            var queueService = helper.GetService<Mock<IPimsService>>();
            queueService.Setup(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), It.IsAny<int?>(), It.IsAny<int?>(), It.IsAny<bool>()));
            queueService.Setup(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), It.IsAny<bool>()));

            var approve = init.ProjectStatus.First(s => s.Code == "AP-SPL");
            project.StatusId = approve.Id; // Submit Status
            var metadata = new DisposalProjectMetadata()
            {
                ClearanceNotificationSentOn = DateTime.UtcNow,
                RequestForSplReceivedOn = DateTime.UtcNow,
                ApprovedForSplOn = DateTime.UtcNow
            };
            project.Metadata = JsonSerializer.Serialize(metadata);

            // Act
            var result = await service.SetStatusAsync(project, project.Workflow.Code);

            // Assert
            Assert.NotNull(result);
            result.StatusId.Should().Be(approve.Id);
            result.Status.Should().Be(approve);
            result.DeniedOn.Should().BeNull();
            result.ApprovedOn.Should().NotBeNull();
            parcel.IsVisibleToOtherAgencies.Should().BeFalse();
            queueService.Verify(m => m.NotificationQueue.GenerateNotifications(It.IsAny<Project>(), null, project.StatusId, true), Times.Never());
            queueService.Verify(m => m.NotificationQueue.SendNotificationsAsync(It.IsAny<IEnumerable<NotificationQueue>>(), true), Times.Once());
        }
        #endregion

        #region Property Financials
        #endregion
        #endregion
    }
}
