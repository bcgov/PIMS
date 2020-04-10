using MapsterMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Building;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using Xunit;
using Pims.Core.Comparers;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "building")]
    public class BuildingControllerTest
    {
        #region Constructors
        public BuildingControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetBuildings
        [Fact]
        public void GetBuildings_FilterLatitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter(50, 25, 50, 20);
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_FilterLongitude_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter(50, 25, 50, 25);
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_FilterAgency_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter()
            {
                Agencies = new int[] { 3 }
            };
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_FilterPredominantUse_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter()
            {
                PredominateUseId = 2
            };
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_FilterConstructionType_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter()
            {
                ConstructionTypeId = 2
            };
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_FilterTenancy_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1);
            var buildings = EntityHelper.CreateBuildings(parcel, 1, 3).ToArray();
            var filter = new BuildingFilter()
            {
                Tenancy = "test"
            };
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.PartialBuildingModel[]>(buildings), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        [Fact]
        public void GetBuildings_Empty__Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new BuildingFilter(0, 25, 10, 20);
            service.Setup(m => m.Building.Get(It.IsAny<BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetBuildings(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            Assert.Empty(actualResult);
            service.Verify(m => m.Building.Get(filter), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Fact]
        public void GetBuildings_Query_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView, new Uri("http://host/api/buildings?Agencies=1,2"));

            var building1 = new Entity.Building(51, 25) { Id = 1 };
            var building2 = new Entity.Building(51, 26) { Id = 2 };
            var buildings = new[] { building1, building2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetBuildings();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.PartialBuildingModel[]>(actionResult.Value);
            var expectedBuildings = mapper.Map<Model.PartialBuildingModel[]>(buildings);
            Assert.Equal(expectedBuildings, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetBuildings_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetBuildings());
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
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetBuildings(null));
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }
        #endregion

        #region GetBuilding
        [Fact]
        public void GetBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var expectedTestBuilding = new Entity.Building(45, 45);
            service.Setup(m => m.Building.Get(It.IsAny<int>())).Returns(expectedTestBuilding);
            int expectedBuildingId = 1;

            // Act
            var result = controller.GetBuilding(expectedBuildingId);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<Model.BuildingModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.BuildingModel>(expectedTestBuilding), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Building.Get(expectedBuildingId), Times.Once());
        }
        #endregion
        #endregion
    }
}
