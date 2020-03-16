using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Dal;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using AdminModel = Pims.Api.Areas.Admin.Models;
using AutoMapper;
using Pims.Api.Models;
using Pims.Api.Test.Helpers;
using Pims.Dal.Entities;
using Pims.Dal.Services;
using Pims.Dal.Services.Admin;
using Pims.Dal.Entities.Models;

namespace PimsApi.Test.Admin.Controllers
{
    public class UserControllerTest
    {
        #region Variables
        private readonly UserController _userController;
        private readonly TestHelper _helper;
        private readonly IMapper _mapper;
        private static readonly int AGENCY_ID = 2;
        private static readonly Guid ROLE_ID = Guid.NewGuid();
        private static readonly Guid USER_ID = Guid.NewGuid();
        private static readonly Guid ACCCESS_REQUEST_ID = Guid.NewGuid();
        private readonly Mock<IPimsAdminService> _pimsService;
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
            var user = PrincipalHelper.CreateForRole("contributor");
            _helper = new TestHelper();
            _helper.CreatePimsAdminService();
            _userController = _helper.CreateAdminUserController(user);
            _mapper = _helper.GetService<IMapper>();
            _pimsService = _helper.GetService<Mock<IPimsAdminService>>();
            var agency = new Entity.Agency()
            {
                Id = AGENCY_ID
            };
            var role = new Entity.Role()
            {
                Id = ROLE_ID
            };
            _expectedAccessRequest.Agencies.Add(new AccessRequestAgency()
            {
                AgencyId = AGENCY_ID,
                Agency = agency,
                AccessRequestId = ACCCESS_REQUEST_ID
            });
            _expectedAccessRequest.Roles.Add(new AccessRequestRole()
            {
                RoleId = ROLE_ID,
                Role = role,
                AccessRequestId = ACCCESS_REQUEST_ID
            });
            _expectedUsers.Roles.Add(new UserRole()
            {
                RoleId = ROLE_ID,
                Role = role,
                UserId = USER_ID
            });
            _expectedUsers.Agencies.Add(new UserAgency()
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
        public void GetAccessRequests()
        {
            var expectedAccessRequests = new Entity.AccessRequest[] { _expectedAccessRequest };
            var expectedPagedAccessRequests = new Pims.Dal.Entities.Models.Paged<AccessRequest>(expectedAccessRequests);
            _pimsService.Setup(m => m.User.GetAccessRequestsNoTracking(1, 10, null, null)).Returns(expectedPagedAccessRequests);
            var result = _userController.GetAccessRequests(1, 10, null);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Pims.Dal.Entities.Models.Paged<AccessRequestModel> actualAccessRequest = Assert.IsType<Pims.Dal.Entities.Models.Paged<AccessRequestModel>>(actionResult.Value);
            Assert.Equal(_mapper.Map<Model.AccessRequestModel[]>(expectedAccessRequests), actualAccessRequest.Items);
        }
        #endregion
        #region GetUsers
        [Fact]
        public void GetUsers()
        {
            var expectedUsers = new Entity.User[] { _expectedUsers };
            var expectedPagedUsers = new Pims.Dal.Entities.Models.Paged<User>(expectedUsers);
            _pimsService.Setup(m => m.User.GetNoTracking(It.IsAny<UserFilter>())).Returns(expectedPagedUsers);
            var result = _userController.GetUsers();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Pims.Dal.Entities.Models.Paged<AdminModel.UserModel> actualAccessRequest = Assert.IsType<Pims.Dal.Entities.Models.Paged<AdminModel.UserModel>>(actionResult.Value);
            Assert.Equal(_mapper.Map<AdminModel.UserModel[]>(expectedUsers), actualAccessRequest.Items);
        }
        #endregion

        #endregion
    }
}
