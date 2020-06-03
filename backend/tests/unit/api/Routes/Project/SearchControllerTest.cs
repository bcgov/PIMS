using Pims.Core.Test;
using Pims.Core.Extensions;
using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Areas.Project.Controllers;
using Pims.Dal.Entities.Models;
using Model = Pims.Api.Areas.Project.Models.Search;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// SearchControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "projects")]
    [Trait("group", "project")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class SearchControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public SearchControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Search_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(SearchController);
            type.HasArea("projects");
            type.HasRoute("[area]/search");
            type.HasRoute("v{version:apiVersion}/[area]/search");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetProjectsPage_Query_Route()
        {
            // Arrange
            var endpoint = typeof(SearchController).FindMethod(nameof(SearchController.GetProjectsPage));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("page");
        }

        [Fact]
        public void GetProjectsPage_Route()
        {
            // Arrange
            var endpoint = typeof(SearchController).FindMethod(nameof(SearchController.GetProjectsPage), typeof(ProjectFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("page/filter");
        }
        #endregion
    }
}
