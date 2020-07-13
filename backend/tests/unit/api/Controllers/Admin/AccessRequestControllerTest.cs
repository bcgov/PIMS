using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Models;
using Pims.Core.Comparers;
using Pims.Core.Test;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

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

            service.Setup(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>())).Returns(paged);

            // Act
            var result = controller.GetPage(1, 10, null, null, null, null, Entity.AccessRequestStatus.OnHold);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>()), Times.Once());
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
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>())).Returns(paged);

            // Act
            var result = controller.GetPage(-1, -10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items,
                new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>()), Times.Once());
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
            service.Setup(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>())).Returns(paged);

            // Act
            var result = controller.GetPage(2, 100);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            Assert.Null(actionResult.StatusCode);
            var actualResult = Assert.IsType<PageModel<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(accessRequests), actualResult.Items, new DeepPropertyCompare());
            service.Verify(m => m.User.GetAccessRequests(It.IsAny<AccessRequestFilter>()), Times.Once());
        }
        #endregion
    }
}

