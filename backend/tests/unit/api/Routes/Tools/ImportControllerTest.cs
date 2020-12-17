using Pims.Api.Areas.Tools.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Test.Routes.Project
{
    /// <summary>
    /// ImportControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class ImportControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ImportControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Import_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(ImportController);
            type.HasPermissions(Permissions.SystemAdmin);
            type.HasArea("tools");
            type.HasRoute("[area]/import");
            type.HasRoute("v{version:apiVersion}/[area]/import");
            type.HasApiVersion("1.0");
        }

        #region Properties
        [Fact]
        public void ImportProperties_Route()
        {
            // Arrange
            var endpoint = typeof(ImportController).FindMethod(nameof(ImportController.ImportProperties), typeof(Model.ImportPropertyModel[]));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("properties");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }

        [Fact]
        public void ImportPropertyFinancials_Route()
        {
            // Arrange
            var endpoint = typeof(ImportController).FindMethod(nameof(ImportController.ImportPropertyFinancials), typeof(Model.ImportPropertyModel[]));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("properties/financials");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }
        #endregion

        #region Projects
        [Fact]
        public void ImportProjects_Route()
        {
            // Arrange
            var endpoint = typeof(ImportController).FindMethod(nameof(ImportController.ImportProjects), typeof(Model.ImportProjectModel[]), typeof(bool), typeof(DateTime?), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("projects");
            endpoint.HasPermissions(Permissions.SystemAdmin);
        }
        #endregion
        #endregion
    }
}
