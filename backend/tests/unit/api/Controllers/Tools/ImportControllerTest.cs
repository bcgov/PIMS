using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Tools.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Test.Controllers.Tools
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "import")]
    [ExcludeFromCodeCoverage]
    public class ImportControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ImportControllerTest() { }
        #endregion

        #region Tests
        #region ImportProperties
        [Fact]
        public void ImportProperties_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var properties = Enumerable.Range(0, 101).Select(i => new Model.ImportPropertyModel()).ToArray();

            // Act
            var result = controller.ImportProperties(properties);

            // Assert
            Assert.NotNull(result);
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void ImportProperties_UpdateParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var properties = new[]
            {
                new Model.ImportPropertyModel()
                {
                    ParcelId = "123-123-123",
                    LocalId = "test",
                    PropertyType = "Land",
                    AgencyCode = "AEST",
                    SubAgency = "School",
                    FiscalYear = 2020,
                    Assessed = 0,
                    Classification = "Classification",
                    Status = "Active",
                    CivicAddress = "test",
                    City = "test",
                    Postal = "T9T9T9",
                    LandArea = 45.55f
                }
            };

            var parcel = new Entity.Parcel()
            {
                Id = 123123123
            };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.BuildingConstructionType.GetAll()).Returns(new Entity.BuildingConstructionType[0]);
            service.Setup(m => m.BuildingPredominateUse.GetAll()).Returns(new Entity.BuildingPredominateUse[0]);
            service.Setup(m => m.PropertyClassification.GetAll()).Returns(new[] { new Entity.PropertyClassification(1, "Classification") });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { new Entity.Agency("AEST", "Advanced Education, Skills & Training") });
            service.Setup(m => m.Parcel.GetByPidWithoutTracking(It.IsAny<int>())).Returns(parcel);
            service.Setup(m => m.AdministrativeArea.Get(It.IsAny<string>())).Returns(new Entity.AdministrativeArea("test"));

            // Act
            var result = controller.ImportProperties(properties);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ParcelModel>>(actionResult.Value);
            Assert.Equal(properties.First().ParcelId, data.First().PID);
            service.Verify(m => m.BuildingConstructionType.GetAll(), Times.Once());
            service.Verify(m => m.BuildingPredominateUse.GetAll(), Times.Once());
            service.Verify(m => m.PropertyClassification.GetAll(), Times.Once());
            service.Verify(m => m.AdministrativeArea.Get(It.IsAny<string>()), Times.Once());
            service.Verify(m => m.Agency.GetAll(), Times.Once());
            service.Verify(m => m.Agency.Add(It.IsAny<Entity.Agency>()), Times.Once());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        #endregion

        #region ImportProjects
        #region Bad Request
        [Fact]
        public void ImportProjects_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var projects = Enumerable.Range(0, 101).Select(i => new Model.ImportProjectModel()).ToArray();

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            var actionResult = Assert.IsType<BadRequestObjectResult>(result);
        }
        #endregion

        #region Success
        [Fact]
        public void ImportProjects_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var project = new Entity.Project();

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);
            pimsService.Setup(m => m.ProjectReport.GetAll()).Returns(Array.Empty<Entity.ProjectReport>().ToArray());

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false, DateTime.UtcNow);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            service.Verify(m => m.Project.Get(projects.First().ProjectNumber), Times.Once());
            service.Verify(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()), Times.Once());
            service.Verify(m => m.Workflow.GetAll(), Times.Once());
            service.Verify(m => m.ProjectStatus.GetAll(), Times.Once());
            service.Verify(m => m.ProjectRisk.GetAll(), Times.Once());
            service.Verify(m => m.Agency.GetAll(), Times.Once());
            service.Verify(m => m.TierLevel.GetAll(), Times.Once());
            pimsService.Verify(m => m.Task.GetForWorkflow(It.IsAny<string>()), Times.Exactly(4));
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Private);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            first.Notes.Last().Note.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial").Value);
            first.Responses.Should().HaveCount(1);
            first.Responses.First().Response.Should().Be(Entity.NotificationResponses.Watch);
            first.Responses.First().ReceivedOn.Should().Be(expectedResult.InterestedReceivedOn.Value);
            project.Snapshots.Should().HaveCount(1);

            var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectSnapshotMetadata>(project.Snapshots.First().Metadata);
            metadata.NetProceeds.Should().Be(expectedResult.PriorNetProceeds);
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_NoPriorNetProceeds_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var project = new Entity.Project();

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Financial", "Note"), new KeyValuePair<string, string>("Private", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Financial);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            first.Notes.First().Note.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial").Value);
            first.Responses.Should().HaveCount(1);
            first.Responses.First().Response.Should().Be(Entity.NotificationResponses.Watch);
            first.Responses.First().ReceivedOn.Should().Be(expectedResult.InterestedReceivedOn.Value);
            project.Snapshots.Should().BeEmpty();
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_WithPriorResponse_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "FirstTier");
            var project = new Entity.Project("RAEG-0001", "Name", tier);
            project.Responses.Add(new Entity.ProjectAgencyResponse(project, agency, Entity.NotificationResponses.Ignore, DateTime.UtcNow.AddDays(-1)));

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier, new Entity.TierLevel(2, "TierLevel") });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Financial", "Note"), new KeyValuePair<string, string>("Private", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Financial);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            first.Notes.First().Note.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial").Value);
            first.Responses.Should().HaveCount(1);
            first.Responses.First().Response.Should().Be(Entity.NotificationResponses.Watch);
            first.Responses.First().ReceivedOn.Should().Be(expectedResult.InterestedReceivedOn.Value);
            project.Snapshots.Should().BeEmpty();
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_NoResponse_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "FirstTier");
            var project = new Entity.Project("RAEG-0001", "Name", tier);

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier, new Entity.TierLevel(2, "TierLevel") });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Financial", "Note"), new KeyValuePair<string, string>("Private", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Financial);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            first.Notes.First().Note.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial").Value);
            first.Responses.Should().BeEmpty();
            project.Snapshots.Should().BeEmpty();
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_WithPriorNote_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "FirstTier");
            var project = new Entity.Project("RAEG-0001", "Name", tier);
            project.Notes.Add(new Entity.ProjectNote(project, Entity.NoteTypes.Financial, "some note"));

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier, new Entity.TierLevel(2, "TierLevel") });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Financial);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            var expectedFinancialNote = expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial");
            first.Notes.First().Note.Should().Be($"some note{Environment.NewLine}{Environment.NewLine}{expectedFinancialNote.Key}{Environment.NewLine}{expectedFinancialNote.Value}");
            first.Responses.Should().BeEmpty();
            project.Snapshots.Should().BeEmpty();
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_WithNoNote_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "FirstTier");
            var project = new Entity.Project("RAEG-0001", "Name", tier);

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier, new Entity.TierLevel(2, "TierLevel") });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().BeEmpty();
            first.Responses.Should().BeEmpty();
            project.Snapshots.Should().BeEmpty();
            project.Tasks.Should().BeEmpty();
        }


        public static IEnumerable<object[]> ProjectActivity =>
            new List<object[]>
            {
                new object[] { "Completed Deal", "SPL" },
                new object[] { "Contract in Place", "SPL" },
                new object[] { "On Market", "SPL" },
                new object[] { "Pre-Market", "SPL" },
                new object[] { "GET LAST ONE", "SPL" },
                new object[] { "", "SPL" },
                new object[] { null, "SPL" }
            };

        /// <summary>
        /// Based on the specified 'Activity' determine the appropriate Workflow.
        /// </summary>
        /// <param name="activity"></param>
        /// <param name="expectedWorkflow"></param>
        [Theory]
        [MemberData(nameof(ProjectActivity))]
        public void ImportProjects_ActivityToWorkflow(string activity, string expectedWorkflow)
        {
            // Arrange
            var helper = new TestHelper();
            var user = helper.CreateForPermission(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);
            var controller = helper.CreateController<ImportController>(user);

            var agency = EntityHelper.CreateAgency(1, "TEST");
            var tier = EntityHelper.CreateTierLevel(1, "TIER");
            var workflows = new[] { EntityHelper.CreateWorkflow(1, "ERP"), EntityHelper.CreateWorkflow(2, "SPL") };
            workflows[0].SortOrder = 1;
            workflows[1].SortOrder = 2;
            var status = EntityHelper.CreateProjectStatus("STATUS", "TEST");
            workflows[0].AddStatus(status, 1);
            workflows[1].AddStatus(status, 2);
            var risk = EntityHelper.CreateProjectRisk("Green", "GREEN", 0);

            var model1 = new Model.ImportProjectModel()
            {
                ProjectNumber = "TEST-00001",
                Description = "Model 1",
                Agency = "TEST",
                Activity = activity,
                Status = "TEST",
                Risk = "GREEN",
                ReportedFiscalYear = 2020,
            };

            var adminServiceMock = helper.GetService<Mock<IPimsAdminService>>();
            adminServiceMock.Setup(m => m.Workflow.GetAll()).Returns(workflows);
            adminServiceMock.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns<int>(id => workflows.First(w => w.Id == id));
            adminServiceMock.Setup(m => m.Workflow.GetForStatus(It.IsAny<string>())).Returns(workflows);
            adminServiceMock.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            adminServiceMock.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            adminServiceMock.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            adminServiceMock.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            adminServiceMock.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            adminServiceMock.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            adminServiceMock.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            adminServiceMock.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            adminServiceMock.Setup(m => m.Project.Get(It.IsAny<string>())).Returns<Entity.Project>(null);

            var serviceMock = helper.GetService<Mock<IPimsService>>();
            serviceMock.Setup(m => m.Task).Returns(helper.GetService<Dal.Services.ITaskService>());
            serviceMock.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            // Act
            var result = controller.ImportProjects(new[] { model1 }, false);

            // Assert
            Assert.NotNull(result);
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<Model.ProjectModel[]>(actionResult.Value);
            actualResult.Should().HaveCount(1);
            actualResult.First().WorkflowCode.Should().Be(expectedWorkflow);
            adminServiceMock.Verify(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()), Times.Once);
            adminServiceMock.Verify(m => m.Project.Update(It.IsAny<IEnumerable<Entity.Project>>()), Times.Once);
        }
        #endregion

        #region Defaults
        [Fact]
        public void ImportProjects_Defaults_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var project = new Entity.Project();

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new[] { new Entity.Task("test") });
            pimsService.Setup(m => m.ProjectReport.GetAll()).Returns(Array.Empty<Entity.ProjectReport>().ToArray());

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Project.Update(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Activity = "Activity",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Financial", "Note"), new KeyValuePair<string, string>("Private", "Note") },
                    NetBook = 1,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false, DateTime.UtcNow, "Risk=Risk;Status=Status;Workflow=Workflow;Agency=Agency;Market=100000");

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().HaveCount(1);
            var expectedResult = projects.First();
            var first = data.First();
            first.ProjectNumber.Should().Be(expectedResult.ProjectNumber);
            first.WorkflowCode.Should().Be(expectedResult.Workflow);
            first.Status.Should().Be(expectedResult.Status);
            first.StatusCode.Should().Be(expectedResult.Status);
            first.ActualFiscalYear.Should().Be(expectedResult.ActualFiscalYear);
            first.ReportedFiscalYear.Should().Be(expectedResult.ReportedFiscalYear);
            first.Agency.Should().Be(expectedResult.Agency);
            first.AgencyCode.Should().Be(expectedResult.Agency);
            first.Manager.Should().Be(expectedResult.Manager);
            first.Name.Should().Be(expectedResult.Description);
            first.Description.Should().Be(expectedResult.Description);
            first.CompletedOn.Should().Be(expectedResult.CompletedOn);
            first.MarketedOn.Should().Be(null);
            first.NetBook.Should().Be(expectedResult.NetBook);
            first.Market.Should().Be(expectedResult.Market);
            first.ProgramCost.Should().Be(expectedResult.ProgramCost);
            first.SalesCost.Should().Be(expectedResult.SalesCost);
            first.InterestComponent.Should().Be(expectedResult.InterestComponent);
            first.NetProceeds.Should().Be(expectedResult.NetProceeds);
            first.GainLoss.Should().Be(expectedResult.GainLoss);
            first.OcgFinancialStatement.Should().Be(expectedResult.OcgFinancialStatement);
            first.Notes.Should().HaveCount(2);
            first.Notes.First().NoteType.Should().Be(Entity.NoteTypes.Financial);
            first.PrivateNote.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Private").Value);
            first.Notes.First().Note.Should().Be(expectedResult.Notes.FirstOrDefault(n => n.Key == "Financial").Value);
            first.Responses.Should().HaveCount(1);
            first.Responses.First().Response.Should().Be(Entity.NotificationResponses.Watch);
            first.Responses.First().ReceivedOn.Should().Be(expectedResult.InterestedReceivedOn.Value);
            project.Snapshots.Should().HaveCount(1);

            var metadata = JsonSerializer.Deserialize<Entity.Models.DisposalProjectSnapshotMetadata>(project.Snapshots.First().Metadata);
            metadata.NetProceeds.Should().Be(expectedResult.PriorNetProceeds);
            project.Tasks.Should().HaveCount(1);
        }
        #endregion

        #region KeyNotFoundExceptions
        [Fact]
        public void ImportProjects_Workflow_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var project = new Entity.Project();

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new Entity.Workflow[0]);
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => controller.ImportProjects(projects, true));
        }

        [Fact]
        public void ImportProjects_Status_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var project = new Entity.Project();

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new Entity.ProjectStatus[0]);
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => controller.ImportProjects(projects, true));
        }

        [Fact]
        public void ImportProjects_Risk_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var project = new Entity.Project();

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new Entity.ProjectRisk[0]);
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => controller.ImportProjects(projects, true));
        }

        [Fact]
        public void ImportProjects_Agency_KeyNotFoundException()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var project = new Entity.Project();

            var agency = new Entity.Agency("Agency", "Agency");
            var tier = new Entity.TierLevel(1, "TierLevel");
            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new Entity.Agency[0]);
            service.Setup(m => m.TierLevel.GetAll()).Returns(new[] { tier });
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tier);
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    InterestedReceivedOn = DateTime.UtcNow.AddDays(1),
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    PriorNetProceeds = 7,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() => controller.ImportProjects(projects, true));
        }
        #endregion

        #region Remove invalid foreign keys
        [Fact]
        public void ImportProjects_InvalidRisk_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new Entity.ProjectRisk[0]);
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_InvalidStatus_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new Entity.ProjectStatus[0]);
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_InvalidWorkflow_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new Entity.Workflow[0]);
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_InvalidAgency_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new Entity.Agency[0]);
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.Should().BeEmpty();
        }
        #endregion

        #region Tiers
        [Fact]
        public void ImportProjects_Tier1_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.First());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 2,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.First().TierLevelId.Should().Be(1);
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_Tier2_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 1000000,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.First().TierLevelId.Should().Be(2);
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_Tier3_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel"), new Entity.TierLevel(3, "TierLevel"), new Entity.TierLevel(4, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            service.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            service.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            service.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            service.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            service.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            service.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            service.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Next(2));
            service.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            service.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            service.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 10000000,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            actualResult.First().TierLevelId.Should().Be(3);
            project.Tasks.Should().BeEmpty();
        }

        [Fact]
        public void ImportProjects_Tier4_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin, Permissions.PropertyAdd, Permissions.AdminProperties);

            var agency = new Entity.Agency("Agency", "Agency");
            var tiers = new[] { new Entity.TierLevel(1, "FirstTier"), new Entity.TierLevel(2, "TierLevel"), new Entity.TierLevel(3, "TierLevel"), new Entity.TierLevel(4, "TierLevel") };
            var project = new Entity.Project("RAEG-0001", "Name", tiers.First());
            project.AddProperty(EntityHelper.CreateParcel(1));
            project.AddProperty(EntityHelper.CreateParcel(2));

            var pimsService = helper.GetService<Mock<IPimsService>>();
            pimsService.Setup(m => m.Task.GetForWorkflow(It.IsAny<string>())).Returns(new Entity.Task[0]);

            var risk = new Entity.ProjectRisk("Risk", "Risk", 1);
            var status = new Entity.ProjectStatus("Status", "Status");
            var workflow = new Entity.Workflow("Workflow", "Workflow");

            var adminService = helper.GetService<Mock<IPimsAdminService>>();
            adminService.Setup(m => m.Project.Get(It.IsAny<string>())).Returns(project);
            adminService.Setup(m => m.Project.Add(It.IsAny<IEnumerable<Entity.Project>>()));
            adminService.Setup(m => m.Workflow.GetAll()).Returns(new[] { workflow });
            adminService.Setup(m => m.ProjectStatus.GetAll()).Returns(new[] { status });
            adminService.Setup(m => m.ProjectRisk.GetAll()).Returns(new[] { risk });
            adminService.Setup(m => m.Agency.GetAll()).Returns(new[] { agency });
            adminService.Setup(m => m.TierLevel.GetAll()).Returns(tiers);
            adminService.Setup(m => m.Agency.Get(It.IsAny<int>())).Returns(agency);
            adminService.Setup(m => m.TierLevel.Get(It.IsAny<int>())).Returns(tiers.Last());
            adminService.Setup(m => m.ProjectRisk.Get(It.IsAny<int>())).Returns(risk);
            adminService.Setup(m => m.ProjectStatus.Get(It.IsAny<int>())).Returns(status);
            adminService.Setup(m => m.Workflow.Get(It.IsAny<int>())).Returns(workflow);
            adminService.Setup(m => m.Parcel.Find(1)).Returns(project.Properties.First().Parcel);
            adminService.Setup(m => m.Parcel.Find(2)).Returns(project.Properties.Last().Parcel);

            var service = helper.GetService<Mock<IPimsService>>();
            service.Setup(m => m.Parcel.Get(1)).Returns(project.Properties.First().Parcel);
            service.Setup(m => m.Parcel.Get(2)).Returns(project.Properties.Last().Parcel);

            var projects = new[]
            {
                new Model.ImportProjectModel()
                {
                    ProjectNumber = "TEST-00001",
                    Workflow = "Workflow",
                    Activity = "Activity",
                    Status = "Status",
                    ActualFiscalYear = 2020,
                    ReportedFiscalYear = 2021,
                    Agency = "Agency",
                    Risk = "Risk",
                    Manager = "Manager",
                    Description = "Description",
                    CompletedOn = DateTime.UtcNow.AddDays(2),
                    MarketedOn = DateTime.UtcNow.AddDays(3),
                    Notes = new [] { new KeyValuePair<string, string>("Private", "Note"), new KeyValuePair<string, string>("Financial", "Note") },
                    NetBook = 1,
                    Market = 10000000,
                    ProgramCost = 3,
                    SalesCost = 4,
                    InterestComponent = 5,
                    NetProceeds = 6,
                    Variance = 8,
                    GainLoss = 9,
                    OcgFinancialStatement = 10,
                    SaleWithLeaseInPlace = true
                }
            };

            // Act
            var result = controller.ImportProjects(projects, false);

            // Assert
            Assert.NotNull(result);
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ProjectModel>>(actionResult.Value);
            data.First().TierLevelId.Should().Be(4);
            project.Tasks.Should().BeEmpty();
        }
        #endregion
        #endregion
        #endregion
    }
}
