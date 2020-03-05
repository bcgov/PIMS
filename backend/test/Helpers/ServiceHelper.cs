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
            var userService = new Mock<Admin.IUserService>();
            service.Setup(m => m.User).Returns(userService.Object);

            helper.AddSingleton(service);
            helper.AddSingleton(service.Object);

            return service.Object;
        }
    }
}
