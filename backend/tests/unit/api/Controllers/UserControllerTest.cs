using MapsterMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model = Pims.Api.Models.User;
using Moq;
using Pims.Api.Controllers;
using Pims.Core.Test;
using Pims.Core.Comparers;
using Pims.Dal.Services;
using Pims.Keycloak;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using Xunit;
using Microsoft.Extensions.Options;
using System;
using Pims.Api.Helpers.Exceptions;
using System.Collections.Generic;

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
        #region UserInfo
        [Fact]
        public async Task UserInfo_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var options = new Pims.Keycloak.Configuration.KeycloakOptions()
            {
                Authority = "test",
                Audience = "test",
                Client = "test",
                OpenIdConnect = new Pims.Keycloak.Configuration.OpenIdConnectOptions()
                {
                    Token = "test",
                    UserInfo = "test"
                }
            };
            var optionsMonitor = new Mock<IOptionsMonitor<Pims.Keycloak.Configuration.KeycloakOptions>>();
            optionsMonitor.Setup(m => m.CurrentValue).Returns(options);
            var controller = helper.CreateController<UserController>(user, optionsMonitor.Object);

            var service = helper.GetService<Mock<IKeycloakRequestClient>>();
            var model = new KModel.UserInfoModel()
            {
                Id = Guid.NewGuid()
            };
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(model))
            };
            service.Setup(m => m.ProxyGetAsync(It.IsAny<HttpRequest>(), It.IsAny<string>())).Returns(Task.FromResult(response));

            // Act
            var result = await controller.UserInfoAsync();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<KModel.UserInfoModel>(actionResult.Value);
            Assert.Equal(model, actualResult, new ShallowPropertyCompare());
            service.Verify(m => m.ProxyGetAsync(It.IsAny<HttpRequest>(), It.IsAny<string>()), Times.Once());
        }
        #endregion

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

        [Fact]
        public void AddAccessRequest_Null_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.AddAccessRequest(null));
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void AddAccessRequest_NullAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = null,
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.AddAccessRequest(model));
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void AddAccessRequest_NullRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AgencyModel>(),
                Roles = null
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.AddAccessRequest(model));
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void AddAccessRequest_InvalidRoles_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AgencyModel>(new[] { new Model.AgencyModel() }),
                Roles = new List<Model.AccessRequestRoleModel>()
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.AddAccessRequest(model));
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }

        [Fact]
        public void AddAccessRequest_InvalidAgencies_BadRequest()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole();
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            var accessRequest = new Model.AccessRequestModel()
            {
                Agencies = new List<Model.AgencyModel>(),
                Roles = new List<Model.AccessRequestRoleModel>(new[] { new Model.AccessRequestRoleModel() })
            };
            var model = mapper.Map<Model.AccessRequestModel>(accessRequest);

            // Act
            // Assert
            Assert.Throws<BadRequestException>(() => controller.AddAccessRequest(model));
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Never());
        }
        #endregion
        #endregion
    }
}
