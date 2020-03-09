using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Controllers;
using Pims.Dal;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using Pims.Dal.Services;
using AutoMapper;
using Pims.Api.Test.Helpers;
using Pims.Api.Models;

namespace PimsApi.Test.Controllers
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
        private readonly Mock<IPimsService> _pimsService;
        private readonly Entity.AccessRequest _expectedAccessRequest = new Entity.AccessRequest()
        {
            Id = ACCCESS_REQUEST_ID,
            Agencies = new Entity.AccessRequestAgency[]
            {
                new Entity.AccessRequestAgency
                {
                    AgencyId = AGENCY_ID,
                    Agency = new Entity.Agency()
                    {
                        Id = AGENCY_ID
                    },
                    AccessRequestId = ACCCESS_REQUEST_ID
                }
            },
            UserId = USER_ID,
            User = new Entity.User
            {
                Id = USER_ID,
                DisplayName = "TEST",
                Email = "test@test.ca"
            },
            Roles = new Entity.AccessRequestRole[]
            {
                new Entity.AccessRequestRole
                {
                    RoleId = ROLE_ID,
                    Role = new Entity.Role()
                    {
                        Id = ROLE_ID
                    },
                    AccessRequestId = ACCCESS_REQUEST_ID
                }
            }
        };

        #endregion

        #region Constructors
        public UserControllerTest()
        {
            var user = PrincipalHelper.CreateForRole("contributor");
            _helper = new TestHelper();
            _helper.CreatePimsService();
            _userController = _helper.CreateUserController(user);
            _mapper = _helper.GetService<IMapper>();
            _pimsService = _helper.GetService<Mock<IPimsService>>();
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void AddAccessRequest_Success()
        {
            var test = new RoleModel()
            {
                Id = ROLE_ID.ToString()
            };
            _mapper.Map<RoleModel, Entity.Role>(test);

            // Execute
            var modelToAdd = _mapper.Map<Entity.AccessRequest, Model.AccessRequestModel>(_expectedAccessRequest);

            _pimsService.Setup(m => m.User.AddAccessRequest(_expectedAccessRequest));
            var result = _userController.AddAccessRequest(_mapper.Map<AccessRequestModel>(_expectedAccessRequest));

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.AccessRequestModel actualAccessRequest = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(_mapper.Map<Model.AccessRequestModel>(_expectedAccessRequest), actualAccessRequest);
        }
        #endregion

        #endregion
    }
}
