using Xunit;
using System;
using Pims.Dal.Services;
using Pims.Api.Test.Helpers;
using Pims.Api.Controllers;
using Moq;
using Model = Pims.Api.Models.User;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using AutoMapper;

namespace PimsApi.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "user")]
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

        #endregion

        #region Constructors
        public UserControllerTest()
        {
            _expectedAccessRequest.Agencies.Add(new Entity.AccessRequestAgency()
            {
                AgencyId = AGENCY_ID,
                Agency = new Entity.Agency()
                {
                    Id = AGENCY_ID
                },
                AccessRequestId = ACCCESS_REQUEST_ID
            });
            _expectedAccessRequest.Roles.Add(new Entity.AccessRequestRole()
            {
                RoleId = ROLE_ID,
                Role = new Entity.Role()
                {
                    Id = ROLE_ID
                },
                AccessRequestId = ACCCESS_REQUEST_ID
            });
        }
        #endregion

        #region Tests
        #region AddAccessRequest
        [Fact]
        public void AddAccessRequest_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("admin-users");
            var helper = new TestHelper();
            var controller = helper.CreateController<UserController>(user);

            var service = helper.GetService<Mock<IUserService>>();
            var mapper = helper.GetService<IMapper>();
            service.Setup(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()));

            // Act
            var result = controller.AddAccessRequest(mapper.Map<Model.AccessRequestModel>(_expectedAccessRequest));

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualAccessRequest = Assert.IsType<Model.AccessRequestModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.AccessRequestModel>(_expectedAccessRequest), actualAccessRequest);
            service.Verify(m => m.AddAccessRequest(It.IsAny<Entity.AccessRequest>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
