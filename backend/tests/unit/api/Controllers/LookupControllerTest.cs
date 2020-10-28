using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Controllers;
using Pims.Core.Comparers;
using Pims.Core.Extensions;
using Pims.Core.Test;
using Pims.Dal;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Lookup;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("group", "lookup")]
    [ExcludeFromCodeCoverage]
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
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(Permissions.PropertyView);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsService>>();
            var agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            service.Setup(m => m.Lookup.GetAgencies()).Returns(new[] { agency });

            // Act
            var result = controller.GetAgencies();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Models.CodeModel<int>[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Models.CodeModel<int>>(agency) }, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Lookup.GetAgencies(), Times.Once());
        }

        [Fact]
        public void GetPropertyClassificationCodes()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(Permissions.PropertyView);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsService>>();
            var propertyClassification = new Entity.PropertyClassification
            {
                Name = "Surplus Active",
            };
            service.Setup(m => m.Lookup.GetPropertyClassifications()).Returns(new[] { propertyClassification });

            // Act
            var result = controller.GetPropertyClassifications();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Models.LookupModel<int>[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Models.LookupModel<int>>(propertyClassification) }, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Lookup.GetPropertyClassifications(), Times.Once());
        }

        [Fact]
        public void GetRoleCodes()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(Permissions.PropertyView);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsService>>();
            var role = new Entity.Role
            {
                Id = Guid.NewGuid(),
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            service.Setup(m => m.Lookup.GetRoles()).Returns(new[] { role });

            // Act
            var result = controller.GetRoles();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Model.RoleModel[]>(actionResult.Value);
            Assert.Equal(new[] { mapper.Map<Model.RoleModel>(role) }, actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Lookup.GetRoles(), Times.Once());
        }

        [Fact]
        public void GetTierLevels()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(Permissions.PropertyView);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsService>>();
            var tierLevels = EntityHelper.CreateDefaultTierLevels().ToArray();
            service.Setup(m => m.Lookup.GetTierLevels()).Returns(tierLevels);

            // Act
            var result = controller.GetTierLevels();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsType<Models.LookupModel<int>[]>(actionResult.Value);
            Assert.Equal(tierLevels.Select(t => mapper.Map<Models.LookupModel<int>>(t)).ToArray(), actualResult, new DeepPropertyCompare());
            service.Verify(m => m.Lookup.GetTierLevels(), Times.Once());
        }

        [Fact]
        public void GetAll()
        {
            // Arrange
            var helper = new TestHelper();
            var controller = helper.CreateController<LookupController>(Permissions.PropertyView);

            var mapper = helper.GetService<IMapper>();
            var service = helper.GetService<Mock<IPimsService>>();
            var role = EntityHelper.CreateRole("admin");
            service.Setup(m => m.Lookup.GetRoles()).Returns(new[] { role });

            var agency = EntityHelper.CreateAgency();
            service.Setup(m => m.Lookup.GetAgencies()).Returns(new[] { agency });

            var propertyClassification = EntityHelper.CreatePropertyClassification("class", true);
            service.Setup(m => m.Lookup.GetPropertyClassifications()).Returns(new[] { propertyClassification });

            var province = EntityHelper.CreateProvince("BC", "British Columbia");
            service.Setup(m => m.Lookup.GetProvinces()).Returns(new[] { province });

            var administrativeArea = EntityHelper.CreateAdministrativeArea("VIC", "Victoria");
            service.Setup(m => m.Lookup.GetAdministrativeAreas()).Returns(new[] { administrativeArea });

            var buildingConstructionType = EntityHelper.CreateBuildingConstructionType("type");
            service.Setup(m => m.Lookup.GetBuildingConstructionTypes()).Returns(new[] { buildingConstructionType });

            var buildingPredominateUse = EntityHelper.CreateBuildingPredominateUse("use");
            service.Setup(m => m.Lookup.GetBuildingPredominateUses()).Returns(new[] { buildingPredominateUse });

            var buildingOccupantType = EntityHelper.CreateBuildingOccupantType("occupant");
            service.Setup(m => m.Lookup.GetBuildingOccupantTypes()).Returns(new[] { buildingOccupantType });

            var tierLevel = EntityHelper.CreateTierLevel("tierlevel");
            service.Setup(m => m.Lookup.GetTierLevels()).Returns(new[] { tierLevel });

            // Act
            var result = controller.GetAll();

            // Assert
            var actionResult = Assert.IsType<JsonResult>(result);
            var actualResult = Assert.IsAssignableFrom<IEnumerable<object>>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.RoleModel>(role), actualResult.First(), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.CodeModel<int>>(agency), actualResult.Next(1), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<int>>(propertyClassification), actualResult.Next(2), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<string>>(province), actualResult.Next(3), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.CodeModel<int>>(administrativeArea), actualResult.Next(4), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<int>>(buildingConstructionType), actualResult.Next(5), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<int>>(buildingPredominateUse), actualResult.Next(6), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<int>>(buildingOccupantType), actualResult.Next(7), new ShallowPropertyCompare());
            Assert.Equal(mapper.Map<Models.LookupModel<int>>(tierLevel), actualResult.Next(8), new ShallowPropertyCompare());
        }
        #endregion
    }
}
