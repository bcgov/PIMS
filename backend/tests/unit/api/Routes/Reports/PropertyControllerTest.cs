using Pims.Api.Areas.Property.Models.Search;
using Pims.Api.Areas.Reports.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Routes.Reports
{
    /// <summary>
    /// ReportControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "report")]
    [Trait("group", "property")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class PropertyControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public PropertyControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Property_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(PropertyController);
            type.HasAuthorize();
            type.HasArea("reports");
            type.HasRoute("[area]/properties");
            type.HasRoute("v{version:apiVersion}/[area]/properties");
        }

        [Fact]
        public void ExportProperties_Query_Route()
        {
            // Arrange
            var endpoint = typeof(PropertyController).FindMethod(nameof(PropertyController.ExportProperties), typeof(bool));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void ExportProperties_Filter_Route()
        {
            // Arrange
            var endpoint = typeof(PropertyController).FindMethod(nameof(PropertyController.ExportProperties), typeof(PropertyFilterModel), typeof(bool));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }
        #endregion
    }
}
