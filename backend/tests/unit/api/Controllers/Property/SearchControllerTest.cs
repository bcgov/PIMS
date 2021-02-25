using MapsterMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Property.Controllers;
using SModel = Pims.Api.Areas.Property.Models.Search;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
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

namespace Pims.Api.Test.Controllers.Property
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "property")]
    [ExcludeFromCodeCoverage]
    public class SearchControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> AllPropertiesFilters = new List<object[]>()
        {
            new object [] { new SModel.PropertyFilterModel(100, 0, 0, 0), false, false },
            new object [] { new SModel.PropertyFilterModel(0, 100, 0, 0), false, false },
            new object [] { new SModel.PropertyFilterModel(0, 0, 10, 0), false, false },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10), false, false },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { Address = "Address" }, false, false },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { Agencies = new [] { 1 } }, false, false },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { StatusId = 1 }, true, true },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { ClassificationId = 1 }, true, true },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { ProjectNumber = "ProjectNumber" }, true, true },
            new object [] { new SModel.PropertyFilterModel(0, 0, 0, 10) { AdministrativeArea = "AdministrativeArea" }, true, true }
        };

        public static IEnumerable<object[]> ParcelOnlyFilters = new List<object[]>()
        {
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MinLotArea = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MaxLotArea = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MinLandArea = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MaxLandArea = 1 } }
        };

        public static IEnumerable<object[]> BuildingOnlyFilters = new List<object[]>()
        {
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { ConstructionTypeId = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { PredominateUseId = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { FloorCount = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { Tenancy = "Tenancy" } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MinRentableArea = 1 } },
            new [] { new SModel.PropertyFilterModel(100, 100, 0, 0) { MaxRentableArea = 1 } }
        };

        public static IEnumerable<object[]> PropertyQueryFilters = new List<object[]>()
        {
            new object [] { new Uri("http://host/api/properties?Agencies=1,2"), true, true },
            new object [] { new Uri("http://host/api/properties?StatusId=2"), true, true },
            new object [] { new Uri("http://host/api/properties?InSurplusPropertyProgram=true"), true, true },
            new object [] { new Uri("http://host/api/properties?ClassificationId=1"), true, true },
            new object [] { new Uri("http://host/api/properties?Address=Address"), true, true },
            new object [] { new Uri("http://host/api/properties?ProjectNumber=ProjectNumber"), true, true },
            new object [] { new Uri("http://host/api/properties?MinLotArea=1"), true, true },
            new object [] { new Uri("http://host/api/properties?MaxLotArea=1"), true, true },
            new object [] { new Uri("http://host/api/properties?MinLandArea=1"), true, false },
            new object [] { new Uri("http://host/api/properties?MaxLandArea=1"), true, false },
            new object [] { new Uri("http://host/api/properties?ConstructionTypeId=1"), false, true },
            new object [] { new Uri("http://host/api/properties?PredominateUseId=1"), false, true },
            new object [] { new Uri("http://host/api/properties?FloorCount=1"), false, true },
            new object [] { new Uri("http://host/api/properties?Tenancy=Tenancy"), false, true },
            new object [] { new Uri("http://host/api/properties?MinRentableArea=1"), false, true },
            new object [] { new Uri("http://host/api/properties?MaxRentableArea=1"), false, true }
        };
        #endregion

        #region Constructors
        public SearchControllerTest()
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
        public void GetProperties_All_Success(SModel.PropertyFilterModel filter, bool includeParcels, bool includeBuildings)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

            var parcel = new Entity.Parcel(1, 51, 25);
            var parcels = new[] { parcel };
            var building = new Entity.Building(parcel, 51, 25)
            {
                PropertyTypeId = 1
            };
            var buildings = new[] { building };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var items = parcels.Select(p => new Entity.Views.Property(p))
                .Concat(buildings.Select(b => new Entity.Views.Property(b))).Select(x => new ProjectProperty(x));
            service.Setup(m => m.Property.Get(It.IsAny<AllPropertyFilter>())).Returns(items);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<SModel.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(parcels).Concat(mapper.Map<SModel.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Property.Get(It.IsAny<AllPropertyFilter>()), Times.Once());
            Assert.Equal(includeParcels, filter.IncludeParcels);
            Assert.Equal(includeBuildings, filter.IncludeBuildings);
        }

        /// <summary>
        /// Make a successful request that only returns parcels.
        /// </summary>
        [Theory]
        [MemberData(nameof(ParcelOnlyFilters))]
        public void GetProperties_OnlyParcels_Success(SModel.PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var items = parcels.Select(p => new ProjectProperty(new Entity.Views.Property(p)));
            service.Setup(m => m.Property.Get(It.IsAny<AllPropertyFilter>())).Returns(items);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<SModel.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Property.Get(It.IsAny<AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that only returns buildings.
        /// </summary>
        [Theory]
        [MemberData(nameof(BuildingOnlyFilters))]
        public void GetProperties_OnlyBuildings_Success(SModel.PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

            var building1 = new Entity.Building() { Id = 1, PropertyTypeId = 1 };
            var building2 = new Entity.Building() { Id = 2, PropertyTypeId = 1 };
            var buildings = new[] { building1, building2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var items = buildings.Select(p => new ProjectProperty(new Entity.Views.Property(p)));
            service.Setup(m => m.Property.Get(It.IsAny<AllPropertyFilter>())).Returns(items);

            // Act
            var result = controller.GetProperties(filter);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<SModel.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(buildings);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Property.Get(It.IsAny<AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "Not required for this test.")]
        [SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not required for this test.")]
        public void GetProperties_Query_Success(Uri uri, bool includeParcels, bool includeBuildings)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView, uri);

            var parcel1 = EntityHelper.CreateParcel(1, 1, 1);
            var parcel2 = EntityHelper.CreateParcel(2, 1, 1);
            var parcels = new[] { parcel1, parcel2 };

            var building1 = EntityHelper.CreateBuilding(parcel1, 10);
            var building2 = EntityHelper.CreateBuilding(parcel1, 11);
            var buildings = new[] { building1, building2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();

            var items = parcels.Select(p => new ProjectProperty(new Entity.Views.Property(p)))
                .Concat(buildings.Select(b => new ProjectProperty(new Entity.Views.Property(b))));
            service.Setup(m => m.Property.Get(It.IsAny<AllPropertyFilter>())).Returns(items);

            // Act
            var result = controller.GetProperties();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<SModel.PropertyModel[]>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(items);
            Assert.Equal(expectedResult, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Property.Get(It.IsAny<AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void GetProperties_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);
            var request = helper.GetService<Mock<HttpRequest>>();
            request.Setup(m => m.QueryString).Returns(new QueryString("?page=0"));

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
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

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
        [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "Not Required")]
        [SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not Required")]
        public void GetPropertiesPage_Success(SModel.PropertyFilterModel filter, bool includeParcels, bool includeBuildings)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

            var parcel = EntityHelper.CreateParcel(1, 51, 25);
            var parcels = new[] { parcel };
            var building = EntityHelper.CreateBuilding(parcel, 51, "p1", "l1");
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
            var actualResult = Assert.IsType<Api.Models.PageModel<SModel.PropertyModel>>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(parcels).JoinAll(mapper.Map<SModel.PropertyModel[]>(buildings));
            Assert.Equal(expectedResult, actualResult.Items, new ShallowPropertyCompare());
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "Not Required")]
        [SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not Required")]
        public void GetPropertiesPage_Query_Success(Uri uri, bool includeParcels, bool includeBuildings)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView, uri);

            var parcel1 = EntityHelper.CreateParcel(1, 51, 25);
            var parcel2 = EntityHelper.CreateParcel(2, 51, 26);
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
            var actualResult = Assert.IsType<Api.Models.PageModel<SModel.PropertyModel>>(actionResult.Value);
            var expectedResult = mapper.Map<SModel.PropertyModel[]>(parcels);
            Assert.Equal(expectedResult, actualResult.Items, new ShallowPropertyCompare());
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
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);
            var request = helper.GetService<Mock<HttpRequest>>();
            request.Setup(m => m.QueryString).Returns(new QueryString("?page=0"));

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
            var controller = helper.CreateController<SearchController>(Permissions.PropertyView);

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
