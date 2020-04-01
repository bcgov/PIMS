using Model = Pims.Api.Areas.Admin.Models.Parcel;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Xunit;
using Pims.Dal.Entities.Models;

namespace Pims.Api.Test.Routes.Admin
{
    /// <summary>
    /// ParcelControllerTest class, provides a way to test endpoint routes.
    /// </summary>
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "parcel")]
    [Trait("group", "route")]
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
            type.HasPermissions(Permissions.SystemAdmin);
            type.HasArea("admin");
            type.HasRoute("[area]/parcels");
            type.HasRoute("v{version:apiVersion}/[area]/parcels");
            type.HasApiVersion("1.0");
        }

        [Fact]
        public void GetParcels_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcels), typeof(int), typeof(int));

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
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcels), typeof(int), typeof(int), typeof(ParcelFilter));

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
            endpoint.HasGet("{id:int}");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetParcelByPid_Int_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcelByPid), typeof(int));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("pid/{id:int}");
            endpoint.HasPermissions(Permissions.PropertyView);
        }

        [Fact]
        public void GetParcelByPid_String_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.GetParcelByPid), typeof(string));

            // Act
            // Assert
            Assert.NotNull(endpoint);
            endpoint.HasGet("pid/{pid:pid}");
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
            endpoint.HasPermissions(Permissions.PropertyAdd);
        }
        #endregion
    }
}
