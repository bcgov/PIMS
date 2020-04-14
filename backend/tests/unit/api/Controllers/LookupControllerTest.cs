using Xunit;
using System;
using Pims.Dal;
using Pims.Api.Controllers;
using Newtonsoft.Json;
using Moq;
using Model = Pims.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using MapsterMapper;
using Pims.Core.Test;
using Pims.Core.Comparers;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "lookup")]
    public class LookupControllerTest
    {
        #region Variables
        #endregion

        #region Constructors
        public LookupControllerTest()
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
            pimsService.Setup(m => m.Lookup.GetAgencies()).Returns(new[] { agency });

            // Act
            var result = controller.GetAgencies();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.CodeModel<int>[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.CodeModel<int>>(agency) }, actualResult, new DeepPropertyCompare());
            pimsService.Verify(m => m.Lookup.GetAgencies(), Times.Once());
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
            pimsService.Setup(m => m.Lookup.GetPropertyClassifications()).Returns(new[] { propertyClassification });

            // Act
            var result = controller.GetPropertyClassifications();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.LookupModel<int>[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.LookupModel<int>>(propertyClassification) }, actualResult, new DeepPropertyCompare());
            pimsService.Verify(m => m.Lookup.GetPropertyClassifications(), Times.Once());
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
            pimsService.Setup(m => m.Lookup.GetRoles()).Returns(new[] { role });

            // Act
            var result = controller.GetRoles();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.LookupModel<Guid>[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.LookupModel<Guid>>(role) }, actualResult, new DeepPropertyCompare());
            pimsService.Verify(m => m.Lookup.GetRoles(), Times.Once());
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
            var role = EntityHelper.CreateRole("admin");
            pimsService.Setup(m => m.Lookup.GetRoles()).Returns(new[] { role });

            var agency = EntityHelper.CreateAgency();
            pimsService.Setup(m => m.Lookup.GetAgencies()).Returns(new[] { agency });

            var propertyStatus = EntityHelper.CreatePropertyStatus("status");
            pimsService.Setup(m => m.Lookup.GetPropertyStatus()).Returns(new[] { propertyStatus });

            var propertyClassification = EntityHelper.CreatePropertyClassification("class");
            pimsService.Setup(m => m.Lookup.GetPropertyClassifications()).Returns(new[] { propertyClassification });

            var province = EntityHelper.CreateProvince("BC", "British Columbia");
            pimsService.Setup(m => m.Lookup.GetProvinces()).Returns(new[] { province });

            var city = EntityHelper.CreateCity("VIC", "Victoria");
            pimsService.Setup(m => m.Lookup.GetCities()).Returns(new[] { city });

            var buildingConstructionType = EntityHelper.CreateBuildingConstructionType("type");
            pimsService.Setup(m => m.Lookup.GetBuildingConstructionTypes()).Returns(new[] { buildingConstructionType });

            var buildingPredominateUse = EntityHelper.CreateBuildingPredominateUse("use");
            pimsService.Setup(m => m.Lookup.GetBuildingPredominateUses()).Returns(new[] { buildingPredominateUse });

            var buildingOccupantType = EntityHelper.CreateBuildingOccupantType("occupant");
            pimsService.Setup(m => m.Lookup.GetBuildingOccupantTypes()).Returns(new[] { buildingOccupantType });

            // Act
            var result = controller.GetAll();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<object>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.LookupModel<Guid>>(role), actualResult.First(), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.CodeModel<int>>(agency), actualResult.Next(1), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<int>>(propertyStatus), actualResult.Next(2), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<int>>(propertyClassification), actualResult.Next(3), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<string>>(province), actualResult.Next(4), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.CodeModel<int>>(city), actualResult.Next(5), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<int>>(buildingConstructionType), actualResult.Next(6), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<int>>(buildingPredominateUse), actualResult.Next(7), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Model.LookupModel<int>>(buildingOccupantType), actualResult.Next(8), new ShallowPropertyCompare());
        }
        #endregion
    }
}
