using Model = Pims.Api.Areas.Admin.Models.Parcel;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using System;
using Xunit;

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

        #region AddParcel
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
        #endregion

        #region UpdateParcel
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
        #endregion

        #region DeleteParcel
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
        #endregion
    }
}
