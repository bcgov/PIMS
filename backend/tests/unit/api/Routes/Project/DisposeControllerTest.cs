using Pims.Core.Test;
using Pims.Core.Extensions;
using Xunit;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Areas.Project.Controllers;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// DisposeControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "projects")]
    [Trait("group", "project")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class DisposeControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public DisposeControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Dispose_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(DisposeController);
            type.HasArea("projects");
            type.HasRoute("[area]/disposal");
            type.HasRoute("v{version:apiVersion}/[area]/disposal");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.GetProject), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{projectNumber}");
        }

        [Fact]
        public void AddProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.AddProject), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
        }

        [Fact]
        public void UpdateProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.UpdateProject), typeof(string), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{projectNumber}");
        }

        [Fact]
        public void DeleteProject_Route()
        {
            // Arrange
            var endpoint = typeof(DisposeController).FindMethod(nameof(DisposeController.DeleteProject), typeof(string), typeof(Model.ProjectModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{projectNumber}");
        }
        #endregion
    }
}
