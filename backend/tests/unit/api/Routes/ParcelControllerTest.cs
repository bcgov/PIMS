using Model = Pims.Api.Models.Parcel;
using Pims.Api.Controllers;
using Pims.Core.Test;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// ParcelControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "parcel")]
    [Trait("group", "route")]
    [ExcludeFromCodeCoverage]
    public class ParcelControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ParcelControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void Parcel_Route()
        {
            // Arrange
            // Act
            // Assert
            var type = typeof(ParcelController);
            type.HasAuthorize();
            type.HasRoute("parcels");
            type.HasRoute("v{version:apiVersion}/parcels");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetParcels_Query_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcels));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet();
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetParcels_Filter_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcels), typeof(Dal.Entities.Models.ParcelFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetParcel_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcel), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("{id}");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void AddParcel_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.AddParcel), typeof(Model.ParcelModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost();
            endpoint.HasPermissions(Permissions.PropertyAdd);
        }

        [Fact]
        public void UpdateParcel_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.UpdateParcel), typeof(int), typeof(Model.ParcelModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPut("{id}");
            endpoint.HasPermissions(Permissions.PropertyEdit);
        }

        [Fact]
        public void DeleteParcel_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.DeleteParcel), typeof(int), typeof(Model.ParcelModel));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasDelete("{id}");
            endpoint.HasPermissions(Permissions.PropertyDelete);
        }

        [Fact]
        public void GetParcelsPage_Query_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcelsPage));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("page");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetParcelsPage_Filter_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcelsPage), typeof(Dal.Entities.Models.ParcelFilter));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasPost("page/filter");
            endpoint.HasPermissions(Permissions.PropertyView);
        }
        #endregion
    }
}
