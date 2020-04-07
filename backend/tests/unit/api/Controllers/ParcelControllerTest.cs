using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.Parcel;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Dal;
using System.Collections.Generic;
using System;
using Xunit;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "parcel")]
    public class ParcelControllerTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilterData =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(50, 25, 50, 20) },
                new object[] { new ParcelFilter(50, 25, 50, 25) },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } } },
                new object[] { new ParcelFilter() { ClassificationId = 2 } }
            };

        public static IEnumerable<object[]> ParcelQueryData =>
            new List<object[]>
            {
                new object[] { new Uri("http://host/api/parcels?Agencies=1,2") },
                new object[] { new Uri("http://host/api/parcels?Address=test") }
            };
        #endregion

        #region Constructors
        public ParcelControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetParcels
        [Theory]
        [MemberData(nameof(ParcelFilterData))]
        public void GetParcels_Success(ParcelFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialParcelModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialParcelModel[]>(parcels), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_Empty_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new ParcelFilter(0, 25, 10, 20);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(new Entity.Parcel[0]);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialParcelModel[]>(actionResult.Value);
            Assert.Empty(actualResult);
            service.Verify(m => m.Parcel.Get(filter), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(ParcelQueryData))]
        public void GetParcels_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView, uri);

            var parcel1 = new Entity.Parcel(51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetParcels();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialParcelModel[]>(actionResult.Value);
            var expectedParcels = mapper.Map<Model.PartialParcelModel[]>(parcels);
            Assert.Equal(expectedParcels, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
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
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
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
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
        }
        #endregion

        #region GetParcel
        [Fact]
        public void GetParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var expectedTestParcel = new Entity.Parcel(45, 45);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(expectedTestParcel);
            int expectedParcelId = 1;

            // Act
            var result = controller.GetParcel(expectedParcelId);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(expectedTestParcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(expectedParcelId), Times.Once());
        }
        #endregion

        #region AddParcel
        [Fact]
        public void AddParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Add(It.IsAny<Entity.Parcel>()));
            var model = mapper.Map<Model.ParcelModel>(parcel);

            // Act
            var result = controller.AddParcel(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            service.Verify(m => m.Parcel.Add(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion

        #region UpdateParcel
        [Fact]
        public void UpdateParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Add(It.IsAny<Entity.Parcel>()));
            var model = mapper.Map<Model.ParcelModel>(parcel);

            // Act
            var result = controller.UpdateParcel(model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion

        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            var modelToDelete = mapper.Map<Model.ParcelModel>(parcel);

            // Act
            var result = controller.DeleteParcel(parcel.Id, modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(parcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
