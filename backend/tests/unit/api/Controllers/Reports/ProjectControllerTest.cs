using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Reports.Controllers;
using Pims.Api.Helpers.Constants;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Controllers.Reports
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "report")]
    [Trait("group", "property")]
    [ExcludeFromCodeCoverage]
    public class ProjectControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> AllPropertiesFilters = new List<object[]>()
        {
            new object [] { new ProjectFilter() },
            new object [] { new ProjectFilter() { ProjectNumber = "username" } },
            new object [] { new ProjectFilter() { Name = "firstname, lastname" } },
            new object [] { new ProjectFilter() { StatusId = new[] { 1 } } },
            new object [] { new ProjectFilter() { TierLevelId = 1 } },
            new object [] { new ProjectFilter() { CreatedByMe = true } },
            new object [] { new ProjectFilter() { SPLWorkflow = true } },
            new object [] { new ProjectFilter() { Active = true } },
            new object [] { new ProjectFilter() { Agencies = new[] { 1 } } },
            new object [] { new ProjectFilter() { Workflows = new[] { "SUBMIT-DISPOSAL" } } },
            new object [] { new ProjectFilter() { ReportId = 1 } },
            new object [] { new ProjectFilter() { FiscalYear = 2020 } },
        };

        public static IEnumerable<object[]> PropertyQueryFilters = new List<object[]>()
        {
            new object [] { new Uri("http://host/api/users?Username=test") },
            new object [] { new Uri("http://host/api/users?DisplayName=test") },
            new object [] { new Uri("http://host/api/users?FirstName=test") },
            new object [] { new Uri("http://host/api/users?LastName=test") },
            new object [] { new Uri("http://host/api/users?LastName=test") },
            new object [] { new Uri("http://host/api/users?Email=test") },
            new object [] { new Uri("http://host/api/users?IsDisabled=false") },
            new object [] { new Uri("http://host/api/users?Position=test") },
            new object [] { new Uri("http://host/api/users?Role=test") },
        };
        #endregion

        #region Constructors
        public ProjectControllerTest()
        {
        }
        #endregion

        #region Tests
        #region ExportProjects
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportProjects_Csv_Success(ProjectFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);
            var agency = EntityHelper.CreateAgency(1);

            var project = new Entity.Project() { Agency = agency, ActualFiscalYear = 2021, ReportedFiscalYear = 2021 };
            var projects = new[] { project };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Entity.Models.Paged<Entity.Project>(projects, filter.Page, filter.Quantity);
            service.Setup(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.ExportProjects(filter);

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Fact]
        public void ExportProjects_Csv_Query_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);
            var agency = EntityHelper.CreateAgency(1);

            var project = new Entity.Project() { Agency = agency, ActualFiscalYear = 2021, ReportedFiscalYear = 2021 };
            var projects = new[] { project };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.Project>(projects);
            service.Setup(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.ExportProjects();

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportProjects_ExcelX_Success(ProjectFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);
            var agency = EntityHelper.CreateAgency(1);

            var project = new Entity.Project() { Agency = agency, ActualFiscalYear = 2021, ReportedFiscalYear = 2021 };
            var projects = new[] { project };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.Project>(projects, filter.Page, filter.Quantity);
            service.Setup(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.ExportProjects(filter);

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportProjects_ExcelX_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);
            var agency = EntityHelper.CreateAgency(1);

            var project = new Entity.Project() { Agency = agency, ActualFiscalYear = 2021, ReportedFiscalYear = 2021 };
            var projects = new[] { project };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.Project>(projects);
            service.Setup(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.ExportProjects();

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Project.GetExcelPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void ExportProjects_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProjects());
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a filter object.
        /// </summary>
        [Fact]
        public void ExportProjects_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProjects(null));
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportProjects_NoAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new ProjectFilter() { };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProjects(filter));
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportProjects_InvalidAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ProjectController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns("invalid");
            var filter = new ProjectFilter() { };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProjects(filter));
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
