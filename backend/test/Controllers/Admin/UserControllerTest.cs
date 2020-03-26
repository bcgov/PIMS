using Xunit;
using System;
using Pims.Dal.Services.Admin;
using Pims.Api.Test.Helpers;
using Pims.Api.Areas.Admin.Controllers;
using Moq;
using Model = Pims.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using AutoMapper;
using AdminModel = Pims.Api.Areas.Admin.Models;
using Pims.Dal.Security;

namespace PimsApi.Test.Admin.Controllers
{
    public class UserControllerTest
    {
        #region Variables
        private static readonly int AGENCY_ID = 2;
        private static readonly Guid ROLE_ID = Guid.NewGuid();
        private static readonly Guid USER_ID = Guid.NewGuid();
        private static readonly Guid ACCCESS_REQUEST_ID = Guid.NewGuid();
        private readonly Entity.AccessRequest _expectedAccessRequest = new Entity.AccessRequest()
        {
            Id = ACCCESS_REQUEST_ID,
            UserId = USER_ID,
            User = new Entity.User
            {
                Id = USER_ID,
                DisplayName = "TEST",
                Email = "test@test.ca"
            },
        };
        private readonly Entity.User _expectedUsers = new Entity.User()
        {
            Id = USER_ID,
            DisplayName = "TEST",
            Email = "test@test.ca"
        };

        #endregion

        #region Constructors
        public UserControllerTest()
        {
            var agency = new Entity.Agency()
            {
                Id = AGENCY_ID
            };
            var role = new Entity.Role()
            {
                Id = ROLE_ID
            };
            _expectedAccessRequest.Agencies.Add(new Entity.AccessRequestAgency()
            {
                AgencyId = AGENCY_ID,
                Agency = agency,
                AccessRequestId = ACCCESS_REQUEST_ID
            });
            _expectedAccessRequest.Roles.Add(new Entity.AccessRequestRole()
            {
                RoleId = ROLE_ID,
                Role = role,
                AccessRequestId = ACCCESS_REQUEST_ID
            });
            _expectedUsers.Roles.Add(new Entity.UserRole()
            {
                RoleId = ROLE_ID,
                Role = role,
                UserId = USER_ID
            });
            _expectedUsers.Agencies.Add(new Entity.UserAgency()
            {
                AgencyId = AGENCY_ID,
                Agency = agency,
                UserId = USER_ID
            });
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void GetAccessRequests_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var expectedAccessRequests = new Entity.AccessRequest[] { _expectedAccessRequest };
            var expectedPagedAccessRequests = new Entity.Models.Paged<Entity.AccessRequest>(expectedAccessRequests);
            service.Setup(m => m.User.GetAccessRequestsNoTracking(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(expectedPagedAccessRequests);

            // Act
            var result = controller.GetAccessRequests(1, 10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualAccessRequest = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(expectedAccessRequests), actualAccessRequest.Items);
            service.Verify(m => m.User.GetAccessRequestsNoTracking(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>()), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMin_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var expectedAccessRequests = new Entity.AccessRequest[] { _expectedAccessRequest };
            var expectedPagedAccessRequests = new Entity.Models.Paged<Entity.AccessRequest>(expectedAccessRequests);
            service.Setup(m => m.User.GetAccessRequestsNoTracking(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(expectedPagedAccessRequests);

            // Act
            var result = controller.GetAccessRequests(-1, -10);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualAccessRequest = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(expectedAccessRequests), actualAccessRequest.Items);
            service.Verify(m => m.User.GetAccessRequestsNoTracking(1, 1, null, null), Times.Once());
        }

        [Fact]
        public void GetAccessRequests_PageMax_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var expectedAccessRequests = new Entity.AccessRequest[] { _expectedAccessRequest };
            var expectedPagedAccessRequests = new Entity.Models.Paged<Entity.AccessRequest>(expectedAccessRequests);
            service.Setup(m => m.User.GetAccessRequestsNoTracking(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>())).Returns(expectedPagedAccessRequests);

            // Act
            var result = controller.GetAccessRequests(2, 100);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualAccessRequest = Assert.IsType<Entity.Models.Paged<Model.AccessRequestModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel[]>(expectedAccessRequests), actualAccessRequest.Items);
            service.Verify(m => m.User.GetAccessRequestsNoTracking(2, 20, null, null), Times.Once());
        }
        #endregion

        #region GetUsers
        [Fact]
        public void GetUsers()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.AdminUsers);
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsAdminService>>();
            var expectedUsers = new Entity.User[] { _expectedUsers };
            var expectedPagedUsers = new Entity.Models.Paged<Entity.User>(expectedUsers);
            service.Setup(m => m.User.GetNoTracking(It.IsAny<Entity.Models.UserFilter>())).Returns(expectedPagedUsers);

            // Act
            var result = controller.GetUsers();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualAccessRequest = Assert.IsType<Entity.Models.Paged<AdminModel.UserModel>>(actionResult.Value);
            Assert.Equal(mapper.Map<AdminModel.UserModel[]>(expectedUsers), actualAccessRequest.Items);
            service.Verify(m => m.User.GetNoTracking(It.IsAny<Entity.Models.UserFilter>()), Times.Once());
        }
        #endregion

        #endregion
    }
}
