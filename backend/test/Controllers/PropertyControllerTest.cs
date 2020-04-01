using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.Property;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Models.Property;
using Pims.Api.Test.Helpers;
using Pims.Dal;
using Pims.Dal.Security;
using System;
using System.Linq;
using Xunit;
using Pims.Core.Comparers;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
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
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Fact]
        public void GetProperties_FilterLatitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel = new Entity.Parcel(51, 25);
            var parcels = new[] { parcel };
            var building = new Entity.Building(51, 25);
            var buildings = new[] { building };
            var filter = new PropertyFilterModel(50, 25, 50, 20);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels).Concat(mapper.Map<Model.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes longitude.
        /// </summary>
        [Fact]
        public void GetProperties_FilterLongitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel = new Entity.Parcel(51, 25);
            var parcels = new[] { parcel };
            var building = new Entity.Building(51, 25);
            var buildings = new[] { building };
            var filter = new PropertyFilterModel(50, 25, 50, 25);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels).Concat(mapper.Map<Model.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that only returns parcels.
        /// </summary>
        [Fact]
        public void GetProperties_OnlyParcels_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel1 = new Entity.Parcel(51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };
            var filter = new PropertyFilterModel(100, 100, 0, 0) { StatusId = 1 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a successful request that only returns buildings.
        /// </summary>
        [Fact]
        public void GetProperties_OnlyBuildings_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var building1 = new Entity.Building(51, 25) { Id = 1 };
            var building2 = new Entity.Building(51, 26) { Id = 2 };
            var buildings = new[] { building1, building2 };
            var filter = new PropertyFilterModel(100, 100, 0, 0) { ConstructionTypeId = 1 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(buildings);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Fact]
        public void GetProperties_Query_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, new Uri("http://host/api/properties?Agencies=1,2"));

            var parcel1 = new Entity.Parcel(51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetProperties();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetProperties_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProperties());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetProperties_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProperties(null));
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
