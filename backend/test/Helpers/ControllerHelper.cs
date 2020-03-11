using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Controllers;
using AdminController = Pims.Api.Areas.Admin.Controllers;
using System.Net.Http;
using Pims.Api.Helpers;

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
        public static ParcelController CreateParcelController(this TestHelper helper, ClaimsPrincipal user)
        {
            var logger = new Mock<ILogger<ParcelController>>();
            helper.AddSingleton(logger.Object);
            helper.AddSingleton<ParcelController>();
            helper.AddSingleton(CreateControllerContext(user));

            var controller = helper.GetService<ParcelController>();
            controller.ControllerContext = helper.GetService<ControllerContext>();
            return controller;
        }

        public static UserController CreateUserController(this TestHelper helper, ClaimsPrincipal user)
        {
            var logger = new Mock<ILogger<UserController>>();
            var requestClient = new Mock<IKeycloakRequestClient>();
            helper.AddSingleton(logger.Object);
            helper.AddSingleton(requestClient.Object);
            helper.AddSingleton<UserController>();
            helper.AddSingleton(CreateControllerContext(user));

            var controller = helper.GetService<UserController>();
            controller.ControllerContext = helper.GetService<ControllerContext>();
            return controller;
        }

        public static AdminController.UserController CreateAdminUserController(this TestHelper helper, ClaimsPrincipal user)
        {
            var logger = new Mock<ILogger<AdminController.UserController>>();
            helper.AddSingleton(logger.Object);
            var httpClientFactory = new Mock<IHttpClientFactory>();
            helper.AddSingleton(httpClientFactory.Object);
            helper.AddSingleton<AdminController.UserController>();
            helper.AddSingleton(CreateControllerContext(user));

            var controller = helper.GetService<AdminController.UserController>();
            controller.ControllerContext = helper.GetService<ControllerContext>();
            return controller;
        }

        /// <summary>
        /// Provides a quick way to create a ControllerContext with the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static ControllerContext CreateControllerContext(ClaimsPrincipal user)
        {
            return new ControllerContext()
            {
                HttpContext = HttpContextHelper.CreateHttpContext(user)
            };
        }
    }
}
