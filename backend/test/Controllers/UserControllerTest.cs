using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.User;
using Moq;
using Pims.Api.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Dal.Services;
using Xunit;
using Pims.Core.Comparers;

namespace PimsApi.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "user")]
    public class UserControllerTest
    {
        #region Constructors
        public UserControllerTest()
        {
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void AddAccessRequest_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = EntityHelper.CreateAccessRequest();
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            var result = controller.AddAccessRequest(model);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            Assert.Equal(model.Agencies, actualResult.Agencies, new DeepPropertyCompare());
            Assert.Equal(model.Roles, actualResult.Roles, new DeepPropertyCompare());
            Assert.Equal(model.User.Id, actualResult.User.Id);
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
