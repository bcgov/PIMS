using Moq;
using Pims.Dal;
using Pims.Dal.Services;
using Admin = Pims.Dal.Services.Admin;

namespace Pims.Api.Test.Helpers
{
    public static class ServiceHelper
    {
        /// <summary>
        /// Provides a quick way to create a new instance of a PimsService object.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static IPimsService CreatePimsService(this TestHelper helper)
        {
            var service = new Mock<IPimsService>();
            var parcelService = new Mock<IParcelService>();
            service.Setup(m => m.Parcel).Returns(parcelService.Object);

            var lookupService = new Mock<ILookupService>();
            service.Setup(m => m.Lookup).Returns(lookupService.Object);

            var userService = new Mock<IUserService>();
            service.Setup(m => m.User).Returns(userService.Object);

            helper.AddSingleton(service);
            helper.AddSingleton(service.Object);
            helper.AddSingleton(parcelService);
            helper.AddSingleton(parcelService.Object);
            helper.AddSingleton(lookupService);
            helper.AddSingleton(lookupService.Object);
            helper.AddSingleton(userService);
            helper.AddSingleton(userService.Object);

            return service.Object;
        }

        /// <summary>
        /// Provides a quick way to create a new instance of a PimsAdminService object.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static Admin.IPimsAdminService CreatePimsAdminService(this TestHelper helper)
        {
            var service = new Mock<Admin.IPimsAdminService>();

            var parcelService = new Mock<Admin.IParcelService>();
            service.Setup(m => m.Parcel).Returns(parcelService.Object);

            var addressService = new Mock<Admin.IAddressService>();
            service.Setup(m => m.Address).Returns(addressService.Object);

            var agencyService = new Mock<Admin.IAgencyService>();
            service.Setup(m => m.Agency).Returns(agencyService.Object);

            var buildingConstructionTypeService = new Mock<Admin.IBuildingConstructionTypeService>();
            service.Setup(m => m.BuildingConstructionType).Returns(buildingConstructionTypeService.Object);

            var buildingPredominateUseService = new Mock<Admin.IBuildingPredominateUseService>();
            service.Setup(m => m.BuildingPredominateUse).Returns(buildingPredominateUseService.Object);

            var buildingService = new Mock<Admin.IBuildingService>();
            service.Setup(m => m.Building).Returns(buildingService.Object);

            var cityService = new Mock<Admin.ICityService>();
            service.Setup(m => m.City).Returns(cityService.Object);

            var propertyClassificationService = new Mock<Admin.IPropertyClassificationService>();
            service.Setup(m => m.PropertyClassification).Returns(propertyClassificationService.Object);

            var propertyStatusService = new Mock<Admin.IPropertyStatusService>();
            service.Setup(m => m.PropertyStatus).Returns(propertyStatusService.Object);

            var propertyTypeService = new Mock<Admin.IPropertyTypeService>();
            service.Setup(m => m.PropertyType).Returns(propertyTypeService.Object);

            var provinceService = new Mock<Admin.IProvinceService>();
            service.Setup(m => m.Province).Returns(provinceService.Object);

            var roleService = new Mock<Admin.IRoleService>();
            service.Setup(m => m.Role).Returns(roleService.Object);

            var userService = new Mock<Admin.IUserService>();
            service.Setup(m => m.User).Returns(userService.Object);

            helper.AddSingleton(service);
            helper.AddSingleton(service.Object);
            helper.AddSingleton(parcelService);
            helper.AddSingleton(parcelService.Object);
            helper.AddSingleton(addressService);
            helper.AddSingleton(addressService.Object);
            helper.AddSingleton(agencyService);
            helper.AddSingleton(agencyService.Object);
            helper.AddSingleton(buildingConstructionTypeService);
            helper.AddSingleton(buildingConstructionTypeService.Object);
            helper.AddSingleton(buildingPredominateUseService);
            helper.AddSingleton(buildingPredominateUseService.Object);
            helper.AddSingleton(buildingService);
            helper.AddSingleton(buildingService.Object);
            helper.AddSingleton(cityService);
            helper.AddSingleton(cityService.Object);
            helper.AddSingleton(propertyClassificationService);
            helper.AddSingleton(propertyClassificationService.Object);
            helper.AddSingleton(propertyStatusService);
            helper.AddSingleton(propertyStatusService.Object);
            helper.AddSingleton(propertyTypeService);
            helper.AddSingleton(propertyTypeService.Object);
            helper.AddSingleton(provinceService);
            helper.AddSingleton(provinceService.Object);
            helper.AddSingleton(roleService);
            helper.AddSingleton(roleService.Object);
            helper.AddSingleton(userService);
            helper.AddSingleton(userService.Object);

            return service.Object;
        }
    }
}
