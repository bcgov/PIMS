using MapsterMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.Property;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Helpers.Exceptions;
using Pims.Api.Models.Property;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Security;
using System;
using System.Linq;
using Xunit;
using Pims.Core.Comparers;
using System.Collections.Generic;
using Pims.Dal.Entities.Models;
using Pims.Core.Extensions;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
    public class PropertyControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> AllPropertiesFilters = new List<object[]>()
        {
            new [] { new PropertyFilterModel(100, 0, 0, 0) },
            new [] { new PropertyFilterModel(0, 100, 0, 0) },
            new [] { new PropertyFilterModel(0, 0, 10, 0) },
            new [] { new PropertyFilterModel(0, 0, 0, 10) },
            new [] { new PropertyFilterModel(0, 0, 0, 10) { StatusId = 1 } },
            new [] { new PropertyFilterModel(0, 0, 0, 10) { ClassificationId = 1 } },
            new [] { new PropertyFilterModel(0, 0, 0, 10) { Address = "Address" } },
            new [] { new PropertyFilterModel(0, 0, 0, 10) { Agencies = new [] { 1 } } },
            new [] { new PropertyFilterModel(0, 0, 0, 10) { ProjectNumber = "ProjectNumber" } }
        };

        public static IEnumerable<object[]> ParcelOnlyFilters = new List<object[]>()
        {
            new [] { new PropertyFilterModel(100, 100, 0, 0) { Municipality = "Municipality" } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MinLotArea = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MaxLotArea = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MinLandArea = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MaxLandArea = 1 } }
        };

        public static IEnumerable<object[]> BuildingOnlyFilters = new List<object[]>()
        {
            new [] { new PropertyFilterModel(100, 100, 0, 0) { ConstructionTypeId = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { PredominateUseId = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { FloorCount = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { Tenancy = "Tenancy" } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MinRentableArea = 1 } },
            new [] { new PropertyFilterModel(100, 100, 0, 0) { MaxRentableArea = 1 } }
        };

        public static IEnumerable<object[]> PropertyQueryFilters = new List<object[]>()
        {
            new [] { new Uri("http://host/api/properties?Agencies=1,2") },
            new [] { new Uri("http://host/api/properties?StatusId=2") },
            new [] { new Uri("http://host/api/properties?ClassificationId=1") },
            new [] { new Uri("http://host/api/properties?Address=Address") },
            new [] { new Uri("http://host/api/properties?ProjectNumber=ProjectNumber") }
        };
        #endregion

        #region Constructors
        public PropertyControllerTest()
        {
        }
        #endregion

        #region Tests
        #region GetProperties
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void GetProperties_All_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel = new Entity.Parcel(1, 51, 25);
            var parcels = new[] { parcel };
            var building = new Entity.Building(parcel, 51, 25);
            var buildings = new[] { building };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels).Concat(mapper.Map<Model.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that only returns parcels.
        /// </summary>
        [Theory]
        [MemberData(nameof(ParcelOnlyFilters))]
        public void GetProperties_OnlyParcels_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a successful request that only returns buildings.
        /// </summary>
        [Theory]
        [MemberData(nameof(BuildingOnlyFilters))]
        public void GetProperties_OnlyBuildings_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var building1 = new Entity.Building() { Id = 1 };
            var building2 = new Entity.Building() { Id = 2 };
            var buildings = new[] { building1, building2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(buildings);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(buildings);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void GetProperties_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, uri);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>())).Returns(parcels);
            service.Setup(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>())).Returns(new Entity.Building[0]);

            // Act
            var result = controller.GetProperties();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Once());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetProperties_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProperties());
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
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
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetProperties(null));
            service.Verify(m => m.Parcel.Get(It.IsAny<Entity.Models.ParcelFilter>()), Times.Never());
            service.Verify(m => m.Building.Get(It.IsAny<Entity.Models.BuildingFilter>()), Times.Never());
        }
        #endregion

        #region GetPropertiesPage
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void GetPropertiesPage_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var parcel = new Entity.Parcel(1, 51, 25);
            var parcels = new[] { parcel };
            var building = new Entity.Building(parcel, 51, 25);
            var buildings = new[] { building };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var items = parcels.Select(p => new Entity.Views.Property(p)).Concat(buildings.Select(b => new Entity.Views.Property(b)));
            var page = new Paged<Entity.Views.Property>(items, filter.Page, filter.Quantity);
            service.Setup(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>())).Returns(page);

            // Act
            var result = controller.GetPropertiesPage(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.PropertyModel>>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels).JoinAll(mapper.Map<Model.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void GetPropertiesPage_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, uri);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var items = parcels.Select(p => new Entity.Views.Property(p));
            var page = new Paged<Entity.Views.Property>(items);
            service.Setup(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>())).Returns(page);

            // Act
            var result = controller.GetPropertiesPage();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Api.Models.PageModel<Model.PropertyModel>>(actionResult.Value);
            var expectedResult = mapper.Map<Model.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetPropertiesPage_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetPropertiesPage());
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a fitler object.
        /// </summary>
        [Fact]
        public void GetPropertiesPage_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.GetPropertiesPage(null));
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
