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
                new object[] { new ParcelFilter() { StatusId = 2 } },
                new object[] { new ParcelFilter() { ClassificationId = 2 } },
                new object[] { new ParcelFilter() { Description = "test" } },
                new object[] { new ParcelFilter() { Municipality = "test" } },
                new object[] { new ParcelFilter() { Zoning = "test" } },
                new object[] { new ParcelFilter() { ZoningPotential = "test" } },
                new object[] { new ParcelFilter() { ProjectNumber = "test" } }
            };

        public static IEnumerable<object[]> ParcelQueryData =>
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
        [MemberData(nameof(ParcelFilterData))]
        public void GetParcels_Success(ParcelFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var paged = new Paged<Entity.Parcel>(existingParcels, 1, 2, 2);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(paged);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(existingParcels), 1, 1, 2);
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
            var existingParcels = EntityHelper.CreateParcels(1, 3).ToArray();
            var paged = new Paged<Entity.Parcel>(existingParcels, 1, 2, 2);
            service.Setup(m => m.Parcel.Get(It.IsAny<ParcelFilter>())).Returns(paged);
            var filter = new ParcelFilter();

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(existingParcels), 1, 1, 2);
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

            var existingParcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var existingParcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var existingParcels = new[] { existingParcel1, existingParcel2 };
            var paged = new Paged<Entity.Parcel>(existingParcels, 1, 2, 2);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(paged);

            // Act
            var result = controller.GetParcels();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Paged<Model.ParcelModel>>(actionResult.Value);
            var expectedResult = new Paged<Model.ParcelModel>(mapper.Map<Model.ParcelModel[]>(existingParcels), 1, 1, 2);
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
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);

            // Act
            var result = controller.GetParcel(existingParcel.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(existingParcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(existingParcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_Int_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(existingParcel);

            // Act
            var result = controller.GetParcelByPid(existingParcel.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(existingParcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetByPid(existingParcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_Int_NoContent()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Throws(new KeyNotFoundException());

            // Act
            var result = controller.GetParcelByPid(existingParcel.Id);

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(204, actionResult.StatusCode);
            service.Verify(m => m.Parcel.GetByPid(existingParcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_String_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(existingParcel);

            // Act
            var result = controller.GetParcelByPid("000-000-001");

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(existingParcel), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.GetByPid(existingParcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcelByPid_String_NoContent()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            existingParcel.PIN = 3;
            existingParcel.Description = "Municipality";
            existingParcel.LandArea = 3434.34f;
            existingParcel.LandLegalDescription = "LandLegalDescription";
            existingParcel.Municipality = "Municipality";
            existingParcel.Zoning = "Zoning";
            existingParcel.ZoningPotential = "ZoningPotential";
            existingParcel.IsSensitive = false;
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Throws(new KeyNotFoundException());

            // Act
            var result = controller.GetParcelByPid("000-000-001");

            // Assert
            var actionResult = Assert.IsType<NoContentResult>(result);
            Assert.Equal(204, actionResult.StatusCode);
            service.Verify(m => m.Parcel.GetByPid(existingParcel.Id), Times.Once());
        }

        [Fact]
        public void GetParcel_Model()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);

            // Act
            var result = controller.GetParcel(existingParcel.Id);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(existingParcel.Id, actualResult.Id);
            Assert.Equal(existingParcel.ParcelIdentity, actualResult.PID);
            Assert.Equal(existingParcel.PIN, actualResult.PIN);
            Assert.Equal(existingParcel.StatusId, actualResult.StatusId);
            Assert.Equal(existingParcel.ClassificationId, actualResult.ClassificationId);
            Assert.Equal(existingParcel.AgencyId, actualResult.AgencyId);
            Assert.Equal(existingParcel.Description, actualResult.Description);
            Assert.Equal(existingParcel.AddressId, actualResult.Address.Id);
            Assert.Equal(existingParcel.Latitude, actualResult.Latitude);
            Assert.Equal(existingParcel.Longitude, actualResult.Longitude);
            Assert.Equal(existingParcel.LandArea, actualResult.LandArea);
            Assert.Equal(existingParcel.LandLegalDescription, actualResult.LandLegalDescription);
            Assert.Equal(existingParcel.Municipality, actualResult.Municipality);
            Assert.Equal(existingParcel.Zoning, actualResult.Zoning);
            Assert.Equal(existingParcel.ZoningPotential, actualResult.ZoningPotential);
            Assert.Equal(existingParcel.IsSensitive, actualResult.IsSensitive);
            Assert.Equal(existingParcel.Buildings.Count(), actualResult.Buildings.Count());
            Assert.Equal(existingParcel.Evaluations.Count(), actualResult.Evaluations.Count());
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
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            var modelToDelete = mapper.Map<Model.ParcelModel>(existingParcel);

            // Act
            var result = controller.DeleteParcel(existingParcel.Id, modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(existingParcel), actualResult, new DeepPropertyCompare());
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
            var existingParcel = EntityHelper.CreateParcel(1);
            service.Setup(m => m.Parcel.Add(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(existingParcel);

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
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(existingParcel);

            // Act
            var result = controller.UpdateParcel(existingParcel.Id, model);

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
            existingParcel.Evaluations.Add(new Entity.ParcelEvaluation(existingParcel, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 12345.45f));

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(updatingParcel, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 12345.45f));
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(updatingParcel, new DateTime(2019, 1, 1), Entity.EvaluationKeys.Assessed, 99999.33f));

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
            existingParcel.Evaluations.Add(new Entity.ParcelEvaluation(existingParcel, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 12345.45f));

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Evaluations.Add(new Entity.ParcelEvaluation(updatingParcel, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 10000.45f));

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
            Assert.Equal(model.Evaluations.First().Value, actualParcel.Evaluations.First().Value);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_AddFiscal_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            existingParcel.Fiscals.Add(new Entity.ParcelFiscal(existingParcel, 2020, Entity.FiscalKeys.Estimated, 12345.45f));

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Fiscals.Add(new Entity.ParcelFiscal(updatingParcel, 2020, Entity.FiscalKeys.Estimated, 12345.45f));
            updatingParcel.Fiscals.Add(new Entity.ParcelFiscal(updatingParcel, 2019, Entity.FiscalKeys.Estimated, 99999.33f));

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Fiscals.Count(), actualParcel.Fiscals.Count());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_UpdateFiscal_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            existingParcel.Fiscals.Add(new Entity.ParcelFiscal(existingParcel, 2020, Entity.FiscalKeys.Estimated, 12345.45f));

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            updatingParcel.Fiscals.Add(new Entity.ParcelFiscal(updatingParcel, 2020, Entity.FiscalKeys.Estimated, 10000.45f));

            service.Setup(m => m.Parcel.Get(It.IsAny<int>())).Returns(existingParcel);
            service.Setup(m => m.Parcel.Update(It.IsAny<Entity.Parcel>())).Returns(existingParcel);
            var model = mapper.Map<Model.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(model.Fiscals.Count(), actualParcel.Fiscals.Count());
            Assert.Equal(model.Fiscals.First().Value, actualParcel.Fiscals.First().Value);
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
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(existingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding1 = EntityHelper.CreateBuilding(updatingParcel, 1, "0001");
            updatingBuilding1.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding1, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 9999.33f));
            updatingParcel.Buildings.Add(updatingBuilding1);

            var updatingBuilding2 = EntityHelper.CreateBuilding(updatingParcel, 2, "0002");
            updatingBuilding2.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding2, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 9999.33f));
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
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(existingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 9999.33f));
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
            Assert.Equal(model.Buildings.First().Evaluations.First().Value, actualParcel.Buildings.First().Evaluations.First().Value);
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
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(existingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 1000.33f));
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding, new DateTime(2021, 1, 1), Entity.EvaluationKeys.Assessed, 2342.33f));
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
            Assert.Equal(model.Buildings.First().Evaluations.First().Value, actualParcel.Buildings.First().Evaluations.First().Value);
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
            existingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(existingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Evaluations.Add(new Entity.BuildingEvaluation(updatingBuilding, new DateTime(2020, 1, 1), Entity.EvaluationKeys.Assessed, 9999.33f));
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
            Assert.Equal(model.Buildings.First().Evaluations.First().Value, actualParcel.Buildings.First().Evaluations.First().Value);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_AddBuildingFiscal_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Fiscals.Add(new Entity.BuildingFiscal(existingBuilding, 2020, Entity.FiscalKeys.Estimated, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Fiscals.Add(new Entity.BuildingFiscal(updatingBuilding, 2020, Entity.FiscalKeys.Estimated, 1000.33f));
            updatingBuilding.Fiscals.Add(new Entity.BuildingFiscal(updatingBuilding, 2021, Entity.FiscalKeys.Estimated, 2342.33f));
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
            Assert.Equal(model.Buildings.First().Fiscals.Count(), actualParcel.Buildings.First().Fiscals.Count());
            Assert.Equal(model.Buildings.First().Fiscals.First().Value, actualParcel.Buildings.First().Fiscals.First().Value);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void UpdateParcel_UpdateBuildingFiscal_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var existingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var existingBuilding = EntityHelper.CreateBuilding(existingParcel, 1, "0001");
            existingBuilding.Fiscals.Add(new Entity.BuildingFiscal(existingBuilding, 2020, Entity.FiscalKeys.Estimated, 1000.33f));
            existingParcel.Buildings.Add(existingBuilding);

            var updatingParcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var updatingBuilding = EntityHelper.CreateBuilding(updatingParcel, 1, "0002");
            updatingBuilding.Fiscals.Add(new Entity.BuildingFiscal(updatingBuilding, 2020, Entity.FiscalKeys.Estimated, 9999.33f));
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
            Assert.Equal(model.Buildings.First().Fiscals.Count(), actualParcel.Buildings.First().Fiscals.Count());
            Assert.Equal(model.Buildings.First().Fiscals.First().Value, actualParcel.Buildings.First().Fiscals.First().Value);
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
