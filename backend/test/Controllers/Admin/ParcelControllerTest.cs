using AutoMapper;
using Entity = Pims.Dal.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using System;
using Xunit;

namespace Pims.Api.Test.Controllers.Admin
{
    public class ParcelControllerTest
    {
        #region Constructors
        public ParcelControllerTest()
        {
        }
        #endregion

        #region Tests
        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(Permissions.PropertyAdd);

            var service = helper.GetService<Mock<IPimsAdminService>>();
            var mapper = helper.GetService<IMapper>();
            var parcel = EntityHelper.CreateParcel(1, 1, 1, 1);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            var modelToDelete = mapper.Map<Api.Models.ParcelModel>(parcel);

            // Act
            var result = controller.DeleteParcel(Guid.NewGuid(), modelToDelete);

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualParcel = Assert.IsType<Api.Models.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Api.Models.ParcelModel>(parcel), actualParcel);
            service.Verify(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion
        #endregion
    }
}
