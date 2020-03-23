using Xunit;
using System;
using Pims.Dal;
using Pims.Api.Controllers;
using Newtonsoft.Json;
using Moq;
using Model = Pims.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using AutoMapper;
using Pims.Api.Test.Helpers;

namespace Pims.Api.Test.Controllers
{
    public class CodeLookupControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public CodeLookupControllerTest()
        {
        }
        #endregion

        #region Tests
        [Fact]
        public void GetAgencyCodes()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("property-view");
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(user);

            var mapper = helper.GetService<IMapper>();
            var pimsService = helper.GetService<Mock<IPimsService>>();
            var agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            pimsService.Setup(m => m.Lookup.GetAgenciesNoTracking()).Returns(new[] { agency });

            // Act
            var result = controller.GetAgencies();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.CodeModel>(agency) }, resultValue);
            pimsService.Verify(m => m.Lookup.GetAgenciesNoTracking(), Times.Once());
        }

        [Fact]
        public void GetPropertyClassificationCodes()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("property-view");
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(user);

            var mapper = helper.GetService<IMapper>();
            var pimsService = helper.GetService<Mock<IPimsService>>();
            var propertyClassification = new Entity.PropertyClassification
            {
                Name = "Surplus Active",
            };
            pimsService.Setup(m => m.Lookup.GetPropertyClassificationsNoTracking()).Returns(new[] { propertyClassification });

            // Act
            var result = controller.GetPropertyClassifications();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.CodeModel>(propertyClassification) }, resultValue);
            pimsService.Verify(m => m.Lookup.GetPropertyClassificationsNoTracking(), Times.Once());
        }

        [Fact]
        public void GetRoleCodes()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("property-view");
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(user);

            var mapper = helper.GetService<IMapper>();
            var pimsService = helper.GetService<Mock<IPimsService>>();
            var role = new Entity.Role
            {
                Id = Guid.NewGuid(),
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            pimsService.Setup(m => m.Lookup.GetRolesNoTracking()).Returns(new[] { role });

            // Act
            var result = controller.GetRoles();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.CodeModel>(role) }, resultValue);
            pimsService.Verify(m => m.Lookup.GetRolesNoTracking(), Times.Once());
        }

        [Fact]
        public void GetAll()
        {
            // Arrange
            var user = PrincipalHelper.CreateForRole("property-view");
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(user);

            var mapper = helper.GetService<IMapper>();
            var pimsService = helper.GetService<Mock<IPimsService>>();
            var role = new Entity.Role
            {
                Id = Guid.NewGuid(),
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            pimsService.Setup(m => m.Lookup.GetRolesNoTracking()).Returns(new[] { role });

            var propertyClassification = new Entity.PropertyClassification
            {
                Name = "Surplus Active",
            };
            pimsService.Setup(m => m.Lookup.GetPropertyClassificationsNoTracking()).Returns(new[] { propertyClassification });

            var agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            pimsService.Setup(m => m.Lookup.GetAgenciesNoTracking()).Returns(new[] { agency });

            // Act
            var agencyResult = controller.GetAgencies();
            var classificationResult = controller.GetPropertyClassifications();
            var roleResult = controller.GetRoles();
            var result = controller.GetAll();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result); // TODO: Should not be testing all four functions.
            JsonResult agencyAction = Assert.IsType<JsonResult>(agencyResult);
            JsonResult roleAction = Assert.IsType<JsonResult>(roleResult);
            JsonResult classificationAction = Assert.IsType<JsonResult>(classificationResult);

            string allResult = JsonConvert.SerializeObject(actionResult.Value);
            string agenciesResult = JsonConvert.SerializeObject(agencyAction.Value);
            string rolesResult = JsonConvert.SerializeObject(roleAction.Value);
            string classificationsResult = JsonConvert.SerializeObject(classificationAction.Value);

            // Removing corresponding []'s as GetAll returns [{one,combined,list}]
            Assert.StartsWith(agenciesResult.Remove(agenciesResult.Length - 1, 1), allResult);
            Assert.Contains(classificationsResult[1..^1], allResult);
            Assert.EndsWith(rolesResult.Substring(1), allResult);
            pimsService.Verify(m => m.Lookup.GetAgenciesNoTracking(), Times.Exactly(2));
            pimsService.Verify(m => m.Lookup.GetPropertyClassificationsNoTracking(), Times.Exactly(2));
            pimsService.Verify(m => m.Lookup.GetRolesNoTracking(), Times.Exactly(2));
        }
        #endregion
    }
}
