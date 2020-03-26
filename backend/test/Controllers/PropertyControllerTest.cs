using Xunit;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Dal;
using Pims.Dal.Security;
using Pims.Api.Models.Property;

namespace Pims.Api.Test.Controllers
{
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
        #region GetProperties
        [Fact]
        public void GetProperties_FilterLatitude()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(user);

            var parcel = new Entity.Parcel(51, 25);
            var parcels = new[] { parcel };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var filter = new PropertyFilterModel(50, 25, 50, 20);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualProperties = Assert.IsType<Model.Property.PropertyModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Property.PropertyModel[]>(parcels), actualProperties);
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        [Fact]
        public void GetProperties_FilterLongitude()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(user);

            var parcel = new Entity.Parcel(51, 25);
            var parcels = new[] { parcel };
            var filter = new PropertyFilterModel(50, 25, 50, 25);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualProperties = Assert.IsType<Model.Property.PropertyModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Property.PropertyModel[]>(parcels), actualProperties);
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        [Fact]
        public void GetProperties_GetMultiple()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(user);

            var parcel1 = new Entity.Parcel(51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };
            var filter = new PropertyFilterModel(100, 100, 0, 0);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualProperties = Assert.IsType<Model.Property.PropertyModel[]>(actionResult.Value);
            var expectedProperties = mapper.Map<Model.Property.PropertyModel[]>(parcels);
            Assert.Equal(expectedProperties, actualProperties);
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.GetNoTracking(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
