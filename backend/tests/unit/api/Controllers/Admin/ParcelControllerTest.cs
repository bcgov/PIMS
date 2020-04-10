using MapsterMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Test;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System.Linq;
using Xunit;
using Pims.Core.Comparers;
using System.Collections.Generic;
using System;
using Pims.Dal.Entities.Models;
using Pims.Api.Helpers.Exceptions;

namespace Pims.Api.Test.Controllers.Admin
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
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
                new object[] { new ParcelFilter() { ClassificationId = 2 } },
                new object[] { new ParcelFilter() { Description = "test" } },
                new object[] { new ParcelFilter() { Municipality = "test" } },
                new object[] { new ParcelFilter() { Zoning = "test" } },
                new object[] { new ParcelFilter() { ZoningPotential = "test" } }
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

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var paged = new Paged<Entity.Parcel>(parcels, 1, 2, 2);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(paged);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(parcels), 1, 1, 2);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_NoFilter_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var paged = new Paged<Entity.Parcel>(parcels, 1, 2, 2);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(paged);
            var filter = new ParcelFilter();

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(parcels), 1, 1, 2);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_Empty__Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var paged = new Paged<Entity.Parcel>(new Entity.Parcel[0], 1, 2, 0);
            var filter = new ParcelFilter(0, 25, 10, 20);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(paged);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            Assert.Empty(actualResult.Items);
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
            var paged = new Paged<Entity.Parcel>(parcels, 1, 2, 2);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(paged);

            // Act
            var result = controller.GetParcels();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(parcels), 1, 1, 2);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<ParcelFilter>()), Times.Once());
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

            var service = helper.GetService<Mock<IPimsAdminService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcels(null));
            service.Verify(m => m.Parcel.Get(null), Times.Never());
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

            var service = helper.GetService<Mock<IPimsAdminService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetParcels(null));
            service.Verify(m => m.Parcel.Get(null), Times.Never());
        }
        #endregion

        #region GetParcel
        [Fact]
        public void GetParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.GetParcel(parcel.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(parcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(parcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_Int_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.GetParcelByPid(parcel.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(parcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetByPid(parcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_Int_NoContent()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Throws(new KeyNotFoundException());

            // Act
            var result = controller.GetParcelByPid(parcel.Id);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(204, actionResult.StatusCode);
            service.Verify(m => m.Parcel.GetByPid(parcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_String_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.GetParcelByPid("000-000-001");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(parcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetByPid(parcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_String_NoContent()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
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
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Throws(new KeyNotFoundException());

            // Act
            var result = controller.GetParcelByPid("000-000-001");

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(204, actionResult.StatusCode);
            service.Verify(m => m.Parcel.GetByPid(parcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcel_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.GetParcel(parcel.Id);

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

        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsAdminService>>();
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

        #region AddParcel
        [Fact]
        public void AddParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
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

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(parcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(parcel);
            var model = mapper.Map<Model.ParcelModel>(parcel);

            // Act
            var result = controller.UpdateParcel(parcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_AddEvaluation_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            existingParcel.Evaluations.Add(new Entity.ParcelEvaluation(2020, existingParcel) { EstimatedValue = 12345.45f });

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(2020, updatingParcel) { EstimatedValue = 12345.45f });
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(2019, updatingParcel) { EstimatedValue = 99999.33f });

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Evaluations.Count(), actualParcel.Evaluations.Count());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_UpdateEvaluation_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            existingParcel.Evaluations.Add(new Entity.ParcelEvaluation(2020, existingParcel) { EstimatedValue = 12345.45f });

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(2020, updatingParcel) { EstimatedValue = 10000.45f });

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Evaluations.Count(), actualParcel.Evaluations.Count());
            Assert.Equal(model.Evaluations.First().EstimatedValue, actualParcel.Evaluations.First().EstimatedValue);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_AddBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, existingBuilding) { EstimatedValue = 1000.33f });
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding1 = EntityHelper.CreateBuilding(updatingParcel, 1, "0001");
            updatingBuilding1.Evaluations.Add(new Entity.BuildingEvaluation(2020, updatingBuilding1) { EstimatedValue = 9999.33f });
            updatingParcel.Buildings.Add(updatingBuilding1);

            var updatingBuilding2 = EntityHelper.CreateBuilding(updatingParcel, 2, "0002");
            updatingBuilding2.Evaluations.Add(new Entity.BuildingEvaluation(2020, updatingBuilding2) { EstimatedValue = 9999.33f });
            updatingParcel.Buildings.Add(updatingBuilding2);

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Buildings.Count(), actualParcel.Buildings.Count());
            Assert.Equal(model.Buildings.First().LocalId, actualParcel.Buildings.First().LocalId);
            Assert.Equal(model.Buildings.First().Evaluations.Count(), actualParcel.Buildings.First().Evaluations.Count());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_UpdateBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, existingBuilding) { EstimatedValue = 1000.33f });
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, updatingBuilding) { EstimatedValue = 9999.33f });
            updatingParcel.Buildings.Add(updatingBuilding);

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Buildings.Count(), actualParcel.Buildings.Count());
            Assert.Equal(model.Buildings.First().LocalId, actualParcel.Buildings.First().LocalId);
            Assert.Equal(model.Buildings.First().Evaluations.Count(), actualParcel.Buildings.First().Evaluations.Count());
            Assert.Equal(model.Buildings.First().Evaluations.First().EstimatedValue, actualParcel.Buildings.First().Evaluations.First().EstimatedValue);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_AddBuildingEvaluation_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, existingBuilding) { EstimatedValue = 1000.33f });
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, updatingBuilding) { EstimatedValue = 1000.33f });
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2021, updatingBuilding) { EstimatedValue = 2342.33f });
            updatingParcel.Buildings.Add(updatingBuilding);

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Buildings.Count(), actualParcel.Buildings.Count());
            Assert.Equal(model.Buildings.First().LocalId, actualParcel.Buildings.First().LocalId);
            Assert.Equal(model.Buildings.First().Evaluations.Count(), actualParcel.Buildings.First().Evaluations.Count());
            Assert.Equal(model.Buildings.First().Evaluations.First().EstimatedValue, actualParcel.Buildings.First().Evaluations.First().EstimatedValue);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_UpdateBuildingEvaluation_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, existingBuilding) { EstimatedValue = 1000.33f });
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(2020, updatingBuilding) { EstimatedValue = 9999.33f });
            updatingParcel.Buildings.Add(updatingBuilding);

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Buildings.Count(), actualParcel.Buildings.Count());
            Assert.Equal(model.Buildings.First().LocalId, actualParcel.Buildings.First().LocalId);
            Assert.Equal(model.Buildings.First().Evaluations.Count(), actualParcel.Buildings.First().Evaluations.Count());
            Assert.Equal(model.Buildings.First().Evaluations.First().EstimatedValue, actualParcel.Buildings.First().Evaluations.First().EstimatedValue);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
