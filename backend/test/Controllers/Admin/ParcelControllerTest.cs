using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Core.Extensions;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Linq;
using Xunit;

namespace Pims.Api.Test.Controllers.Admin
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

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            var modelToDelete = mapper.Map<Api.Models.ParcelModel>(parcel);

            // Act
            var result = controller.DeleteParcel(Guid.NewGuid(), modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Api.Models.ParcelModel>(parcel), actualParcel);
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
            var model = mapper.Map<Api.Models.ParcelModel>(parcel);

            // Act
            var result = controller.AddParcel(model);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(201, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(parcel);

            // Act
            var result = controller.UpdateParcel(parcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
            Assert.Equal(model, actualParcel);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
            var model = mapper.Map<Api.Models.ParcelModel>(updatingParcel);

            // Act
            var result = controller.UpdateParcel(updatingParcel.Id, model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
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
