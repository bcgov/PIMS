using Xunit;
using System.Linq;
using System.Collections.Generic;
using Pims.Dal.Services.Admin;
using Pims.Core.Test;
using Pims.Api.Areas.Admin.Controllers;
using Moq;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using Pims.Dal.Security;

namespace Pims.Api.Test.Controllers.Tools
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "tools")]
    [Trait("group", "import")]
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
        public void ImportProperties_UpdateParcel_Success()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<ImportController>(Permissions.SystemAdmin);

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
            service.Setup(m => m.BuildingConstructionType.GetAll()).Returns(new Entity.BuildingConstructionType[0]);
            service.Setup(m => m.BuildingPredominateUse.GetAll()).Returns(new Entity.BuildingPredominateUse[0]);
            service.Setup(m => m.PropertyStatus.GetAll()).Returns(new[] { new Entity.PropertyStatus(1, "Status") });
            service.Setup(m => m.PropertyClassification.GetAll()).Returns(new[] { new Entity.PropertyClassification(1, "Classification") });
            service.Setup(m => m.City.GetAll()).Returns(new Entity.City[0]);
            service.Setup(m => m.Agency.GetAll()).Returns(new[] { new Entity.Agency("AEST", "Advanced Education, Skills & Training") });
            service.Setup(m => m.Parcel.GetByPid(It.IsAny<int>())).Returns(parcel);

            // Act
            var result = controller.ImportProperties(properties);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            var data = Assert.IsAssignableFrom<IEnumerable<Model.ParcelModel>>(actionResult.Value);
            Assert.Equal(properties.First().ParcelId, data.First().PID);
            service.Verify(m => m.BuildingConstructionType.GetAll(), Times.Once());
            service.Verify(m => m.BuildingPredominateUse.GetAll(), Times.Once());
            service.Verify(m => m.PropertyStatus.GetAll(), Times.Once());
            service.Verify(m => m.PropertyClassification.GetAll(), Times.Once());
            service.Verify(m => m.City.GetAll(), Times.Once());
            service.Verify(m => m.Agency.GetAll(), Times.Once());
            service.Verify(m => m.Agency.Add(It.IsAny<Entity.Agency>()), Times.Once());
            service.Verify(m => m.Parcel.Update(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        #endregion
        #endregion
    }
}
