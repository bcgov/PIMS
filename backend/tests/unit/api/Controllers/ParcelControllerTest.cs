using MapsterMapper;
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
using System.Linq;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "parcel")]
    [ExcludeFromCodeCoverage]
    public class ParcelControllerTest
    {
        #region Data
        public static IEnumerable<object[]> ParcelFilters =>
            new List<object[]>
            {
                new object[] { new ParcelFilter(50, 25, 50, 20) },
                new object[] { new ParcelFilter(50, 25, 50, 25) },
                new object[] { new ParcelFilter() { Agencies = new int[] { 3 } } },
                new object[] { new ParcelFilter() { StatusId = 1 } },
                new object[] { new ParcelFilter() { ClassificationId = 2 } },
                new object[] { new ParcelFilter() { Description = "test" } },
                new object[] { new ParcelFilter() { Municipality = "test" } },
                new object[] { new ParcelFilter() { Zoning = "test" } },
                new object[] { new ParcelFilter() { ZoningPotential = "test" } },
                new object[] { new ParcelFilter() { ProjectNumber = "test" } }
            };

        public static IEnumerable<object[]> ParcelQueries =>
            new List<object[]>
            {
                new object[] { new Uri("http://host/api/parcels?Agencies=1,2") },
                new object[] { new Uri("http://host/api/parcels?Address=test") },
                new object[] { new Uri("http://host/api/parcels?ProjectNumber=test") },
                new object[] { new Uri("http://host/api/parcels?Description=test") },
                new object[] { new Uri("http://host/api/parcels?Municipality=test") },
                new object[] { new Uri("http://host/api/parcels?Zoning=test") },
                new object[] { new Uri("http://host/api/parcels?ZoningPotential=test") },
                new object[] { new Uri("http://host/api/parcels?ClassificationId=1") },
                new object[] { new Uri("http://host/api/parcels?StatusId=1") }
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
        [MemberData(nameof(ParcelFilters))]
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
        [MemberData(nameof(ParcelQueries))]
        public void GetParcels_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView, uri);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(1, 51, 26) { Id = 2 };
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
        public void GetParcels_NoFilter_BadRequest()
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
            var expectedTestParcel = new Entity.Parcel(1, 45, 45);
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

        [Fact]
        public void GetParcel_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            parcel.PIN = 3;
            parcel.Description = "Municipality";
            parcel.LandArea = 3434.34f;
            parcel.LandLegalDescription = "LandLegalDescription";
            parcel.Municipality = "Municipality";
            parcel.Zoning = "Zoning";
            parcel.ZoningPotential = "ZoningPotential";
            parcel.IsSensitive = false;
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(parcel);
            int expectedParcelId = 1;

            // Act
            var result = controller.GetParcel(expectedParcelId);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(parcel.Id, actualResult.Id);
            Assert.Equal(parcel.ParcelIdentity, actualResult.PID);
            Assert.Equal(parcel.PIN, actualResult.PIN);
            Assert.Equal(parcel.StatusId, actualResult.StatusId);
            Assert.Equal(parcel.ClassificationId, actualResult.ClassificationId);
            Assert.Equal(parcel.AgencyId, actualResult.AgencyId);
            Assert.Equal(parcel.Description, actualResult.Description);
            Assert.Equal(parcel.AddressId, actualResult.Address.Id);
            Assert.Equal(parcel.Latitude, actualResult.Latitude);
            Assert.Equal(parcel.Longitude, actualResult.Longitude);
            Assert.Equal(parcel.LandArea, actualResult.LandArea);
            Assert.Equal(parcel.LandLegalDescription, actualResult.LandLegalDescription);
            Assert.Equal(parcel.Municipality, actualResult.Municipality);
            Assert.Equal(parcel.Zoning, actualResult.Zoning);
            Assert.Equal(parcel.ZoningPotential, actualResult.ZoningPotential);
            Assert.Equal(parcel.IsSensitive, actualResult.IsSensitive);
            Assert.Equal(parcel.Buildings.Count(), actualResult.Buildings.Count());
            Assert.Equal(parcel.Evaluations.Count(), actualResult.Evaluations.Count());
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
            var result = controller.UpdateParcel(parcel.Id, model);

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

        #region GetParcelsPage
        [Theory]
        [MemberData(nameof(ParcelFilters))]
        public void GetParcelsPage_Success(ParcelFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var page = new Paged<Entity.Parcel>(parcels);
            service.Setup(m => m.Parcel.GetPage(It.IsAny<ParcelFilter>())).Returns(page);

            // Act
            var result = controller.GetParcelsPage(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.PartialParcelModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialParcelModel[]>(parcels), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetPage(filter), Times.Once());
        }

        [Fact]
        public void GetParcelsPage_Empty_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new ParcelFilter(0, 25, 10, 20);
            service.Setup(m => m.Parcel.GetPage(It.IsAny<ParcelFilter>())).Returns(new Paged<Entity.Parcel>());

            // Act
            var result = controller.GetParcelsPage(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.PartialParcelModel>>(actionResult.Value);
            Assert.Empty(actualResult.Items);
            service.Verify(m => m.Parcel.GetPage(filter), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(ParcelQueries))]
        public void GetParcelsPage_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView, uri);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(1, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };
            var page = new Paged<Entity.Parcel>(parcels);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.GetPage(It.IsAny<Entity.Models.ParcelFilter>())).Returns(page);

            // Act
            var result = controller.GetParcelsPage();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.PartialParcelModel>>(actionResult.Value);
            var expectedParcels = mapper.Map<Model.PartialParcelModel[]>(parcels);
            Assert.Equal(expectedParcels, actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetPage(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetParcelsPage_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcelsPage());
            service.Verify(m => m.Parcel.GetPage(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetParcelsPage_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcelsPage(null));
            service.Verify(m => m.Parcel.GetPage(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
