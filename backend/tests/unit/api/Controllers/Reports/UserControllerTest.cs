using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Reports.Controllers;
using Pims.Api.Helpers.Constants;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Controllers.Reports
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "report")]
    [Trait("group", "property")]
    [ExcludeFromCodeCoverage]
    public class UserControllerTest
    {
        #region Variables
        public static IEnumerable<object[]> AllPropertiesFilters = new List<object[]>()
        {
            new object [] { new UserFilter(1, 100) },
            new object [] { new UserFilter(1, 100) { Username = "username" } },
            new object [] { new UserFilter(1, 100) { DisplayName = "firstname, lastname" } },
            new object [] { new UserFilter(1, 100) { FirstName = "firstname" } },
            new object [] { new UserFilter(1, 100) { LastName = "lastname" } },
            new object [] { new UserFilter(1, 100) { Email = "email" } },
            new object [] { new UserFilter(1, 100) { IsDisabled = false } },
            new object [] { new UserFilter(1, 100) { Position = "position" } },
            new object [] { new UserFilter(1, 100) { Role = "role" } },
        };

        public static IEnumerable<object[]> PropertyQueryFilters = new List<object[]>()
        {
            new object [] { new Uri("http://host/api/users?Username=test") },
            new object [] { new Uri("http://host/api/users?DisplayName=test") },
            new object [] { new Uri("http://host/api/users?FirstName=test") },
            new object [] { new Uri("http://host/api/users?LastName=test") },
            new object [] { new Uri("http://host/api/users?LastName=test") },
            new object [] { new Uri("http://host/api/users?Email=test") },
            new object [] { new Uri("http://host/api/users?IsDisabled=false") },
            new object [] { new Uri("http://host/api/users?Position=test") },
            new object [] { new Uri("http://host/api/users?Role=test") },
        };
        #endregion

        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
        #region ExportUsers
        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportUsers_Csv_Success(UserFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users, filter.Page, filter.Quantity);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers(filter);

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Fact]
        public void ExportUsers_Csv_Query_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_CSV);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers();

            // Assert
            var actionResult = Assert.IsType<ContentResult>(result);
            var actualResult = Assert.IsType<string>(actionResult.Content);
            Assert.Equal(ContentTypes.CONTENT_TYPE_CSV, actionResult.ContentType);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportUsers_Excel_Success(UserFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCEL);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users, filter.Page, filter.Quantity);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers(filter);

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportUsers_Excel_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCEL);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers();

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that includes the latitude.
        /// </summary>
        [Theory]
        [MemberData(nameof(AllPropertiesFilters))]
        public void ExportUsers_ExcelX_Success(UserFilter filter)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users, filter.Page, filter.Quantity);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers(filter);

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a successful request that passes the filter in the query string.
        /// </summary>
        [Theory]
        [MemberData(nameof(PropertyQueryFilters))]
        public void ExportUsers_ExcelX_Query_Success(Uri uri)
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView, uri);
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns(ContentTypes.CONTENT_TYPE_EXCELX);

            var user = new Entity.User(Guid.NewGuid(), "username", "email", "firstname", "lastname");
            var users = new[] { user };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var page = new Paged<Entity.User>(users);
            service.Setup(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>())).Returns(page);

            // Act
            var result = controller.ExportUsers();

            // Assert
            var actionResult = Assert.IsType<FileStreamResult>(result);
            Assert.Equal(ContentTypes.CONTENT_TYPE_EXCELX, actionResult.ContentType);
            Assert.NotNull(actionResult.FileDownloadName);
            Assert.True(actionResult.FileStream.Length > 0);
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }

        /// <summary>
        /// Make a failed request because the query doesn't contain filter values.
        /// </summary>
        [Fact]
        public void ExportUsers_Query_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportUsers());
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a filter object.
        /// </summary>
        [Fact]
        public void ExportUsers_NoFilter_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportUsers(null));
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportUsers_NoAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var filter = new UserFilter() { };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportUsers(filter));
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Never());
        }

        /// <summary>
        /// Make a failed request because the body doesn't contain a valid accept header.
        /// </summary>
        [Fact]
        public void ExportUsers_InvalidAcceptHeader_BadRequest()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(Permissions.PropertyView);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var headers = helper.GetService<Mock<Microsoft.AspNetCore.Http.IHeaderDictionary>>();
            headers.Setup(m => m["Accept"]).Returns("invalid");
            var filter = new UserFilter() { };

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.ExportUsers(filter));
            service.Verify(m => m.User.Get(It.IsAny<Entity.Models.UserFilter>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
