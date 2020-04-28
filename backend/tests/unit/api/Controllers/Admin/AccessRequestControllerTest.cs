using MapsterMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Areas.Admin.Models.User;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Core.Test;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using Pims.Api.Models;
using Xunit;
using Pims.Core.Comparers;

namespace PimsApi.Test.Admin.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "admin")]
    [Trait("group", "accessRequest")]
    public class AccessRequestControllerTest
    {
        #region Constructors
        public AccessRequestControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void GetAccessRequests_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<AccessRequestController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(1);
            var accessRequest2 = EntityHelper.CreateAccessRequest(2);
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Entity.AccessRequestStatus?>())).Returns(paged);

            // Act
            var result = controller.GetPage(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), Entity.AccessRequestStatus.OnHold), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMin_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<AccessRequestController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(1);
            var accessRequest2 = EntityHelper.CreateAccessRequest(2);
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Entity.AccessRequestStatus?>())).Returns(paged);

            // Act
            var result = controller.GetPage(-1, -10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(1, 1, null, Entity.AccessRequestStatus.OnHold), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMax_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<AccessRequestController>(Permissions.AdminUsers);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var accessRequest1 = EntityHelper.CreateAccessRequest(1);
            var accessRequest2 = EntityHelper.CreateAccessRequest(2);
            var accessRequests = new[] { accessRequest1, accessRequest2 };
            var paged = new Entity.Models.Paged<Entity.AccessRequest>(accessRequests);
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Entity.AccessRequestStatus?>())).Returns(paged);

            // Act
            var result = controller.GetPage(2, 100);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(2, 20, null, Entity.AccessRequestStatus.OnHold), Times.Once());
        }
        #endregion
    }
}

