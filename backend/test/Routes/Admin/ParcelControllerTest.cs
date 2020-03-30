using Model = Pims.Api.Models;
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

        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Route()
        {
            // Arrange
            var endpoint = typeof(ParcelController).FindMethod(nameof(ParcelController.DeleteParcel), typeof(Guid), typeof(Model.ParcelModel));

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
