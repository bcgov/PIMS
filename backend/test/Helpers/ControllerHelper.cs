using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Controllers;

namespace Pims.Api.Test.Helpers
{
    public static class ControllerHelper
    {
        /// <summary>
        /// Provides a quick way to create ParcelController for testing.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static ParcelController CreateParcelController (this TestHelper helper, ClaimsPrincipal user)
        {
            var logger = new Mock<ILogger<ParcelController>> ();
            helper.AddSingleton (logger.Object);
            helper.AddSingleton<ParcelController> ();
            helper.AddSingleton (CreateControllerContext (user));

            var controller = helper.GetService<ParcelController> ();
            controller.ControllerContext = helper.GetService<ControllerContext> ();
            return controller;
        }

        /// <summary>
        /// Provides a quick way to create a ControllerContext with the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static ControllerContext CreateControllerContext (ClaimsPrincipal user)
        {
            return new ControllerContext ()
            {
                HttpContext = HttpContextHelper.CreateHttpContext (user)
            };
        }
    }
}
