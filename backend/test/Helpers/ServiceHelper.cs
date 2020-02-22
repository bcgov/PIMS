using Moq;
using Pims.Dal;
using Pims.Dal.Services;

namespace Pims.Api.Test.Helpers
{
    public static class ServiceHelper
    {
        /// <summary>
        /// Provides a quick way to create a new instance of a PimsService object.
        /// </summary>
        /// <param name="helper"></param>
        /// <returns></returns>
        public static IPimsService CreatePimsService (this TestHelper helper)
        {
            var service = new Mock<IPimsService> ();
            var parcelService = new Mock<IParcelService> ();
            service.Setup (m => m.Parcel).Returns (parcelService.Object);

            var lookupService = new Mock<ILookupService> ();
            service.Setup (m => m.Lookup).Returns (lookupService.Object);

            helper.AddSingleton (service);
            helper.AddSingleton (service.Object);
            helper.AddSingleton (parcelService);
            helper.AddSingleton (parcelService.Object);
            helper.AddSingleton (lookupService);
            helper.AddSingleton (lookupService.Object);

            return service.Object;
        }
    }
}
