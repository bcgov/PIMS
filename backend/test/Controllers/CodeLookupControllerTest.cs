using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Controllers;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using AutoMapper;
using Pims.Api.Helpers.Profiles;
using Pims.Dal;
using Newtonsoft.Json;

namespace Pims.Api.Test.Controllers
{
    public class CodeLookupControllerTest
    {
        #region Variables
        private readonly LookupController _lookupController;
        private readonly Mock<IPimsService> _pimsService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        public CodeLookupControllerTest ()
        {
            var logger = new Mock<ILogger<LookupController>> ();
            var config = new Mock<IConfiguration> ();
            var mapperConfig = new MapperConfiguration (cfg =>
            {
                cfg.AddProfile(new LookupProfile());
                cfg.AddProfile (new CodeProfile ());
                cfg.AddProfile(new BaseProfile());
            });
            mapperConfig.AssertConfigurationIsValid();
            _mapper = mapperConfig.CreateMapper ();

            _pimsService = new Mock<IPimsService> ();
            _lookupController = new LookupController (logger.Object, config.Object, _pimsService.Object, _mapper);

            var user = new ClaimsPrincipal (new ClaimsIdentity (new Claim[]
            {
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "contributor")
            }, "mock"));
            _lookupController.ControllerContext = new ControllerContext ()
            {
                HttpContext = new DefaultHttpContext () { User = user }
            };
        }
        #endregion

        #region Tests
        [Fact]
        public void GetAgencyCodes ()
        {
            // Arrange
            var agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            _pimsService.Setup (m => m.Lookup.GetAgenciesNoTracking ()).Returns (new [] { agency });

            // Act
            var result = _lookupController.GetAgencies ();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]> (actionResult.Value);
            Assert.Equal (new [] { _mapper.Map<Model.CodeModel> (agency) }, resultValue);
        }

        [Fact]
        public void GetPropertyClassificationCodes()
        {
            // Arrange
            var propertyClassification = new Entity.PropertyClassification
            {
                Name = "Surplus Active",
            };
            _pimsService.Setup(m => m.Lookup.GetPropertyClassificationsNoTracking()).Returns(new[] { propertyClassification });

            // Act
            var result = _lookupController.GetPropertyClassifications();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { _mapper.Map<Model.CodeModel>(propertyClassification) }, resultValue);
        }

        [Fact]
        public void GetRoleCodes()
        {
            // Arrange
            var role = new Entity.Role
            {
                Id = Guid.NewGuid(),
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            _pimsService.Setup(m => m.Lookup.GetRolesNoTracking()).Returns(new[] { role });

            // Act
            var result = _lookupController.GetRoles();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { _mapper.Map<Model.CodeModel>(role) }, resultValue);
        }

        [Fact]
        public void GetAll()
        {
            // Arrange
            var role = new Entity.Role
            {
                Id = Guid.NewGuid(),
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            _pimsService.Setup(m => m.Lookup.GetRolesNoTracking()).Returns(new[] { role });

            var propertyClassification = new Entity.PropertyClassification
            {
                Name = "Surplus Active",
            };
            _pimsService.Setup(m => m.Lookup.GetPropertyClassificationsNoTracking()).Returns(new[] { propertyClassification });

            var agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            _pimsService.Setup (m => m.Lookup.GetAgenciesNoTracking ()).Returns (new [] { agency });

            // Act
            var agencyResult = _lookupController.GetAgencies();
            var result = _lookupController.GetAll();
            var classificationResult = _lookupController.GetPropertyClassifications();
            var roleResult = _lookupController.GetRoles();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            JsonResult agencyAction = Assert.IsType<JsonResult>(agencyResult);
            JsonResult roleAction = Assert.IsType<JsonResult>(roleResult);
            JsonResult classificationAction = Assert.IsType<JsonResult>(classificationResult);

            string allResult = JsonConvert.SerializeObject(actionResult.Value);
            string agenciesResult = JsonConvert.SerializeObject(agencyAction.Value);
            string rolesResult = JsonConvert.SerializeObject(roleAction.Value);
            string classificationsResult = JsonConvert.SerializeObject(classificationAction.Value);

            // Removing corresponding []'s as GetAll returns [{one,combined,list}]
            Assert.StartsWith(agenciesResult.Remove(agenciesResult.Length - 1, 1), allResult);
            Assert.Contains(classificationsResult.Substring(1, classificationsResult.Length -2), allResult);
            Assert.EndsWith(rolesResult.Substring(1), allResult);
        }
        #endregion
    }
}
