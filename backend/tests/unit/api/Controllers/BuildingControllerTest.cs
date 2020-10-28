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
        #endregion
    }
}
