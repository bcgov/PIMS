using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Property.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Building;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "building")]
    [ExcludeFromCodeCoverage]
    public class BuildingControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> BuildingFilters = new List<object[]>()
        {
            new [] { new BuildingFilter(50, 25, 50, 20)  },
            new [] { new BuildingFilter(0, 25, 50, 25)  },
            new [] { new BuildingFilter() { Agencies = new int[] { 3 } } },
            new [] { new BuildingFilter() { PredominateUseId = 2 } },
            new [] { new BuildingFilter() { ConstructionTypeId = 3 } },
            new [] { new BuildingFilter() { Tenancy = "test" } },
            new [] { new BuildingFilter() { FloorCount = 1 } },
            new [] { new BuildingFilter() { MinRentableArea = 1 } },
            new [] { new BuildingFilter() { MaxRentableArea = 1 } }
        };

        public static IEnumerable<object[]> QueryFilters = new List<object[]>()
        {
            new [] { new Uri("http://host/api/buildings?Agencies=1,2") },
            new [] { new Uri("http://host/api/buildings?StatusId=2") },
            new [] { new Uri("http://host/api/buildings?ClassificationId=1") },
            new [] { new Uri("http://host/api/buildings?Address=Address") },
            new [] { new Uri("http://host/api/buildings?ProjectNumber=ProjectNumber") }
        };
        #endregion

        #region Constructors
        public BuildingControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetBuilding
        [Fact]
        public void GetBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var expectedTestBuilding = new Entity.Building();
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

        #region AddBuilding
        [Fact]
        public void AddBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var expectedTestBuilding = EntityHelper.CreateBuilding(parcel, 1, "1234", "name", 50, 50);
            var user = EntityHelper.CreateUser("Tester");
            expectedTestBuilding.UpdatedBy = user;
            expectedTestBuilding.CreatedBy = user;

            // Mocking the .Add method. If passed any type of Building, returns that building.
            service.Setup(m => m.Building.Add(It.IsAny<Building>())).Returns((Building building) => building);


            // Act
            var building = mapper.Map<Model.BuildingModel>(expectedTestBuilding);
            var result = controller.AddBuilding(building);

            // Assert
            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            var actualResult = Assert.IsType<Model.BuildingModel>(actionResult.Value);
            Assert.Equal(building.Name, actualResult.Name);
            Assert.Equal(building.Id, actualResult.Id);
            Assert.Equal(building.ProjectNumbers, actualResult.ProjectNumbers, new DeepPropertyCompare());
            Assert.Equal(building.Latitude, actualResult.Latitude);
            Assert.Equal(building.Longitude, actualResult.Longitude);
            Assert.Null(actualResult.Agency);
        }
        #endregion

        #region UpdateBuilding
        [Fact]
        public void UpdateBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var expectedTestBuilding = EntityHelper.CreateBuilding(parcel, 1, "1", "name", 50, 50);

            // Mocking the .Update method. If passed any type of Building, returns that building.
            service.Setup(m => m.Building.Update(It.IsAny<Building>())).Returns((Building building) => building);

            // Act
            var building = mapper.Map<Model.BuildingModel>(expectedTestBuilding);

            var result = controller.UpdateBuilding(1, building);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.BuildingModel>(actionResult.Value);
            Assert.Equal(building.Name, actualResult.Name);
            Assert.Equal(building.Id, actualResult.Id);
            Assert.Equal(building.ProjectNumbers, actualResult.ProjectNumbers, new DeepPropertyCompare());
            Assert.Equal(building.Latitude, actualResult.Latitude);
            Assert.Equal(building.Longitude, actualResult.Longitude);
        }
        #endregion

        #region UpdateBuildingFinancials
        [Fact]
        public void UpdateBuildingFinancials_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.PropertyEdit);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var expectedTestBuilding = EntityHelper.CreateBuilding(parcel, 1, "1", "name", 50, 50);
            expectedTestBuilding.ClassificationId = 1;

            // Mocking the .UpdateFinancials method. If passed any type of Building, returns that building.
            service.Setup(m => m.Building.UpdateFinancials(It.IsAny<Building>())).Returns((Building building) => building);

            // Act
            var building = mapper.Map<Model.BuildingModel>(expectedTestBuilding);

            var result = controller.UpdateBuildingFinancials(1, building);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.BuildingModel>(actionResult.Value);
            Assert.Equal(building.Name, actualResult.Name);
            Assert.Equal(building.Id, actualResult.Id);
            Assert.Equal(building.ProjectNumbers, actualResult.ProjectNumbers, new DeepPropertyCompare());
            Assert.Equal(building.Latitude, actualResult.Latitude);
            Assert.Equal(building.Longitude, actualResult.Longitude);
            Assert.Equal(building.ClassificationId, actualResult.ClassificationId);
        }
        #endregion

        #region DeleteBuilding
        [Fact]
        public void DeleteBuilding_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<BuildingController>(Permissions.ProjectDelete);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            var expectedTestBuilding = EntityHelper.CreateBuilding(parcel, 1, "1", "name", 50, 50);

            // Mocking the .Remove method. If passed any type of Building, returns that building.
            service.Setup(m => m.Building.Remove(It.IsAny<Building>()));

            // Act
            var building = mapper.Map<Model.BuildingModel>(expectedTestBuilding);

            var result = controller.DeleteBuilding(1, building);

            // Assert
            // Deletion just returns the original model.
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.BuildingModel>(actionResult.Value);
            Assert.Equal(building.Name, actualResult.Name);
            Assert.Equal(building.Id, actualResult.Id);
            Assert.Equal(building.ProjectNumbers, actualResult.ProjectNumbers, new DeepPropertyCompare());
            Assert.Equal(building.Latitude, actualResult.Latitude);
            Assert.Equal(building.Longitude, actualResult.Longitude);
        }
        #endregion
        #endregion
    }
}
