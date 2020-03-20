using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Test.Helpers;
using Xunit;
using Model = Pims.Api.Areas.Tools.Models;
using Entity = Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using Pims.Dal.Services.Admin;
using System;

namespace Pims.Api.Test.Controllers
{
    public class ImportControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public ImportControllerTest() { }
        #endregion

        #region Tests
        #region ImportProperties
        [Fact]
        public void ImportProperties_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("system-administrator");
            var helper = new TestHelper();
            helper.CreatePimsAdminService();
            var controller = helper.CreateController<ImportController>(user);

            var properties = new[]
            {
                new Model.PropertyModel()
                {
                ParcelId = "123-123-123",
                LocalId = "test",
                PropertyType = "Land",
                Agency = "AEST",
                SubAgency = "School",
                FiscalYear = "2020",
                AssessedValue = "0",
                Classification = "Classification",
                Status = "Status",
                CivicAddress = "test",
                City = "test",
                Postal = "T9T9T9",
                LandArea = "45.55"
                }
            };

            var parcel = new Entity.Parcel()
            {
                Id = 123123123
            };

            var service = helper.GetService<Mock<IPimsAdminService>>();
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { new Entity.Agency("AEST", "Advanced Education, Skills & Training") });
            service.Setup(m => m.PropertyClassification.GetAll()).Returns(new[] { new Entity.PropertyClassification(1, "Classification") });
            service.Setup(m => m.PropertyStatus.GetAll()).Returns(new[] { new Entity.PropertyStatus(1, "Status") });
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.ImportProperties(properties);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Pims.Api.Models.ParcelModel>>(actionResult.Value);
            Assert.Equal(properties.First().ParcelId, data.First().PID);
        }

        #endregion
        #endregion
    }
}
