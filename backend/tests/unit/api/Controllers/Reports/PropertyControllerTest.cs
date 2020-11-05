using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Property.Models.Search;
using Pims.Api.Areas.Reports.Controllers;
using Pims.Api.Helpers.Constants;
using Pims.Api.Helpers.Exceptions;
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

namespace Pims.Api.Test.Controllers.Reports
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "report")]
    [Trait("group", "property")]
    [ExcludeFromCodeCoverage]
    public class PropertyControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> AllPropertiesFilters = new List<object[]>()
        {
            new object [] { new PropertyFilterModel(100, 0, 0, 0) },
            new object [] { new PropertyFilterModel(0, 100, 0, 0) },
            new object [] { new PropertyFilterModel(0, 0, 10, 0) },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { Address = "Address" } },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { Agencies = new [] { 1 } } },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { StatusId = 1 } },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { ClassificationId = 1 } },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { ProjectNumber = "ProjectNumber" } },
            new object [] { new PropertyFilterModel(0, 0, 0, 10) { AdministrativeArea = "AdministrativeArea" } }
        };

        public static IEnumerable<object[]> ParcelOnlyFilters = new List<object[]>()
        {
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
            new object [] { new Uri("http://host/api/properties?Agencies=1,2") },
            new object [] { new Uri("http://host/api/properties?StatusId=2") },
            new object [] { new Uri("http://host/api/properties?ClassificationId=1") },
            new object [] { new Uri("http://host/api/properties?Address=Address") },
            new object [] { new Uri("http://host/api/properties?ProjectNumber=ProjectNumber") },
            new object [] { new Uri("http://host/api/properties?MinLotArea=1") },
            new object [] { new Uri("http://host/api/properties?MaxLotArea=1") },
            new object [] { new Uri("http://host/api/properties?MinLandArea=1") },
            new object [] { new Uri("http://host/api/properties?MaxLandArea=1") },
            new object [] { new Uri("http://host/api/properties?ConstructionTypeId=1") },
            new object [] { new Uri("http://host/api/properties?PredominateUseId=1") },
            new object [] { new Uri("http://host/api/properties?FloorCount=1") },
            new object [] { new Uri("http://host/api/properties?Tenancy=Tenancy") },
            new object [] { new Uri("http://host/api/properties?MinRentableArea=1") },
            new object [] { new Uri("http://host/api/properties?MaxRentableArea=1") }
        };
        #endregion

        #region Constructors
        public PropertyControllerTest()
        {
        }
        #endregion

        #region Tests
        #region ExportProperties
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportProperties_Csv_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);

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
            var result = controller.ExportProperties(filter);

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportProperties_Csv_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var items = parcels.Select(p => new Entity.Views.Property(p));
            var page = new Paged<Entity.Views.Property>(items);
            service.Setup(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>())).Returns(page);

            // Act
            var result = controller.ExportProperties();

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportProperties_Excel_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCEL);

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
            var result = controller.ExportProperties(filter);

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportProperties_Excel_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCEL);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var items = parcels.Select(p => new Entity.Views.Property(p));
            var page = new Paged<Entity.Views.Property>(items);
            service.Setup(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>())).Returns(page);

            // Act
            var result = controller.ExportProperties();

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportProperties_ExcelX_Success(PropertyFilterModel filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);

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
            var result = controller.ExportProperties(filter);

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportProperties_ExcelX_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);

            var parcel1 = new Entity.Parcel(1, 51, 25) { Id = 1 };
            var parcel2 = new Entity.Parcel(2, 51, 26) { Id = 2 };
            var parcels = new[] { parcel1, parcel2 };

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var items = parcels.Select(p => new Entity.Views.Property(p));
            var page = new Paged<Entity.Views.Property>(items);
            service.Setup(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>())).Returns(page);

            // Act
            var result = controller.ExportProperties();

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void ExportProperties_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProperties());
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a filter object.
        /// </summary>
        [Fact]
        public void ExportProperties_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProperties(null));
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportProperties_NoAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var filter = new PropertyFilterModel(100, 0, 0, 0) { StatusId = 1 };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProperties(filter));
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportProperties_InvalidAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<PropertyController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsService>>();
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns("invalid");
            var filter = new PropertyFilterModel(100, 0, 0, 0) { StatusId = 1 };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportProperties(filter));
            service.Verify(m => m.Property.GetPage(It.IsAny<Entity.Models.AllPropertyFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
