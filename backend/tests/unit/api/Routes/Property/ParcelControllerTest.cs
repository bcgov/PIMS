using Pims.Api.Areas.Property.Controllers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Areas.Property.Models.Parcel;

namespace Pims.Api.Test.Routes
{
    /// <summary>
    /// ParcelControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
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
            type.HasArea("properties");
            type.HasRoute("[area]/parcels");
            type.HasRoute("v{version:apiVersion}/[area]/parcels");
            type.HasApiVersion("1.0");
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
            endpoint.HasPermissions(Permissions.PropertyDelete, Permissions.PropertyEdit);
        }
        #endregion
    }
}
