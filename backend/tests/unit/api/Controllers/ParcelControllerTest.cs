using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Property.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;

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
                new object[] { new ParcelFilter() { ClassificationId = 2 } },
                new object[] { new ParcelFilter() { Description = "test" } },
                new object[] { new ParcelFilter() { AdministrativeArea = "test" } },
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
                new object[] { new Uri("http://host/api/parcels?AdministrativeArea=test") },
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
            parcel.Description = "Description";
            parcel.LandArea = 3434.34f;
            parcel.LandLegalDescription = "LandLegalDescription";
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
            Assert.Equal(parcel.ClassificationId, actualResult.ClassificationId);
            Assert.Equal(parcel.AgencyId, actualResult.AgencyId);
            Assert.Equal(parcel.Description, actualResult.Description);
            Assert.Equal(parcel.AddressId, actualResult.Address.Id);
            Assert.Equal(parcel.Location.Y, actualResult.Latitude);
            Assert.Equal(parcel.Location.X, actualResult.Longitude);
            Assert.Equal(parcel.LandArea, actualResult.LandArea);
            Assert.Equal(parcel.LandLegalDescription, actualResult.LandLegalDescription);
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
            service.Setup(m => m.Parcel.Add(It.IsAny<Entity.Parcel>())).Returns(parcel);
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
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(parcel);
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
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyDelete);

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

        #region Check if PID is available
        [Fact]
        public void IsPidAvailable_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var expectedResults = new Model.CheckPidAvailabilityResponseModel { Available = true };
            service.Setup(m => m.Parcel.IsPidAvailable(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(true);

            // Act
            var result = controller.IsPidAvailable(1, 1);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.CheckPidAvailabilityResponseModel>(actionResult.Value);
            Assert.Equal(expectedResults, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.IsPidAvailable(1, 1), Times.Once());
        }
        #endregion

        #region Check if PIN is available
        [Fact]
        public void IsPinAvailable_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var expectedResults = new Model.CheckPidAvailabilityResponseModel { Available = true };
            service.Setup(m => m.Parcel.IsPinAvailable(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(true);

            // Act
            var result = controller.IsPinAvailable(1, 1);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.CheckPidAvailabilityResponseModel>(actionResult.Value);
            Assert.Equal(expectedResults, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.IsPinAvailable(1, 1), Times.Once());
        }
        #endregion

        #endregion
    }
}
