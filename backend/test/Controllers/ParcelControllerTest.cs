using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Test.Helpers;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using Xunit;

namespace Pims.Api.Test.Controllers
{
    public class ParcelControllerTest
    {
        #region Constructors
        public ParcelControllerTest()
        {
        }
        #endregion

        #region Tests
        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            var modelToDelete = mapper.Map<Model.ParcelModel>(parcel);

            // Act
            var result = controller.DeleteParcel(Guid.NewGuid(), modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(parcel), actualParcel);
            service.Verify(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion

        #region GetParcels
        [Fact]
        public void GetParcels_FilterLatitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var filter = new ParcelFilter(50, 25, 50, 20);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Parts.ParcelModel[]>(parcels), actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterLongitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var filter = new ParcelFilter(50, 25, 50, 25);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Parts.ParcelModel[]>(parcels), actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterAgency_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var filter = new ParcelFilter()
            {
                Agencies = new int[] { 3 }
            };
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Parts.ParcelModel[]>(parcels), actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterClassification_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var filter = new ParcelFilter()
            {
                ClassificationId = 2
            };
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.Parts.ParcelModel[]>(parcels), actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_Empty__Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new ParcelFilter(0, 25, 10, 20);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new Entity.Parcel[0]);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Empty(actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Fact]
        public void GetParcels_Query_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView, new Uri("http://host/api/parcels?Agencies=1,2"));

            var parcel1 = new Entity.Parcel(51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            var expectedParcels = mapper.Map<Model.Parts.ParcelModel[]>(parcels);
            Assert.Equal(expectedParcels, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetParcels_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcels());
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetProperties_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcels(null));
            service.Verify(m => m.Parcel.GetNoTracking(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
        }
        #endregion

        #region GetParcel
        [Fact]
        public void GetParcel_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<int>())).Throws<KeyNotFoundException>();
            int expectedParcelId = 1;

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                controller.GetParcel(expectedParcelId));
            service.Verify(m => m.Parcel.GetNoTracking(expectedParcelId), Times.Once());
        }

        [Fact]
        public void GetParcel_Sucess()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var expectedTestParcel = new Entity.Parcel(45, 45);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<int>())).Returns(expectedTestParcel);
            int expectedParcelId = 1;

            // Act
            var result = controller.GetParcel(expectedParcelId);

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            var actualParcelDetail = Assert.IsType<Model.ParcelModel>(jsonResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(expectedTestParcel), actualParcelDetail);
            service.Verify(m => m.Parcel.GetNoTracking(expectedParcelId), Times.Once());
        }

        #endregion
        #endregion
    }
}
