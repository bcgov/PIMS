using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Project.Controllers;
using Pims.Api.Areas.Project.Models.Search;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Controllers.Project
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "project")]
    [ExcludeFromCodeCoverage]
    public class SearchControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> ProjectsFilters = new List<object[]>()
        {
            new object [] { new ProjectFilter() { ProjectNumber = "ProjectNumber" } },
            new object [] { new ProjectFilter() { Name = "Name" } },
            new object [] { new ProjectFilter() { Agencies = new [] { 1 } } },
            new object [] { new ProjectFilter() { StatusId = new[] { 1 } } },
            new object [] { new ProjectFilter() { TierLevelId = 1 } }
        };

        public static IEnumerable<object[]> ProjectQueryFilters = new List<object[]>()
        {
            new object [] { new Uri("http://host/api/projects?Agencies=1,2") },
            new object [] { new Uri("http://host/api/projects?StatusId=2") },
            new object [] { new Uri("http://host/api/projects?TierLevelId=1") },
            new object [] { new Uri("http://host/api/projects?Name=Name") },
            new object [] { new Uri("http://host/api/projects?ProjectNumber=ProjectNumber") }
        };
        #endregion

        #region Constructors
        public SearchControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetProjectsPage
        /// <summary>
        /// Make a successful request with a filter.
        /// </summary>
        [Theory]
        [MemberData(nameof(ProjectsFilters))]
        public void GetProjectsPage_Success(ProjectFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.ProjectView);

            var projects = EntityHelper.CreateProjects(1, 20);
            var parcels = EntityHelper.CreateParcels(1, 2);
            var buildings1 = EntityHelper.CreateBuildings(parcels.Next(0), 1, 5);
            var buildings2 = EntityHelper.CreateBuildings(parcels.Next(1), 6, 5);

            projects.Next(0).AddProperty(parcels.Next(0));
            projects.Next(0).AddProperty(buildings1.ToArray());

            projects.Next(1).AddProperty(parcels.Next(1));
            projects.Next(1).AddProperty(buildings2.ToArray());

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Entity.Models.Paged<Entity.Project>(projects, filter.Page, filter.Quantity);
            service.Setup(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.GetProjectsPage(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<ProjectModel>>(actionResult.Value);
            var expectedResult = mapper.Map<ProjectModel[]>(projects);
            Assert.Equal(expectedResult, actualResult.Items.ToArray(), new ShallowPropertyCompare());
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request with a query filter.
        /// </summary>
        [Theory]
        [MemberData(nameof(ProjectQueryFilters))]
        public void GetProjectsPage_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.ProjectView, uri);

            var projects = EntityHelper.CreateProjects(1, 20);
            var parcels = EntityHelper.CreateParcels(1, 2);
            var buildings1 = EntityHelper.CreateBuildings(parcels.Next(0), 1, 5);
            var buildings2 = EntityHelper.CreateBuildings(parcels.Next(1), 6, 5);

            projects.Next(0).AddProperty(parcels.Next(0));
            projects.Next(0).AddProperty(buildings1.ToArray());

            projects.Next(1).AddProperty(parcels.Next(1));
            projects.Next(1).AddProperty(buildings2.ToArray());

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Entity.Models.Paged<Entity.Project>(projects);
            service.Setup(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>())).Returns(page);

            // Act
            var result = controller.GetProjectsPage();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<ProjectModel>>(actionResult.Value);
            var expectedResult = mapper.Map<ProjectModel[]>(projects);
            Assert.Equal(expectedResult, actualResult.Items.ToArray(), new ShallowPropertyCompare());
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetProjectsPage_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.ProjectView);
            var request = helper.GetService<Mock<HttpRequest>>();
            request.Setup(m => m.QueryString).Returns(new QueryString("?page=0"));

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProjectsPage());
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetProjectsPage_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.ProjectView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProjectsPage(null));
            service.Verify(m => m.Project.GetPage(It.IsAny<Entity.Models.ProjectFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
