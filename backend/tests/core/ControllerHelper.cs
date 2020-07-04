using System.Security.Claims;
using System;
using Microsoft.AspNetCore.Mvc;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using Pims.Dal;
using Microsoft.Extensions.Options;

namespace Pims.Core.Test
{
    /// <summary>
    /// ControllerHelper static class, provides helper functions for setting up tests for controllers.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class ControllerHelper
    {
        #region Methods
        /// <summary>
        /// Creates an instance of a controller of the specified 'T' type and initializes it with the specified 'user'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a controller you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateController<T>(this TestHelper helper, ClaimsPrincipal user, params object[] args) where T : ControllerBase
        {
            return helper.CreateController<T>(user, null, args);
        }

        /// <summary>
        /// Creates an instance of a controller of the specified 'T' type and initializes it with a user with the specified 'permission'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a controller you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateController<T>(this TestHelper helper, Permissions permission, params object[] args) where T : ControllerBase
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreateController<T>(user, null, args);
        }

        /// <summary>
        /// Creates an instance of a controller of the specified 'T' type and initializes it with a user with the specified 'permission'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a controller you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="permission"></param>
        /// <param name="uri"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateController<T>(this TestHelper helper, Permissions permission, Uri uri, params object[] args) where T : ControllerBase
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreateController<T>(user, uri, args);
        }

        /// <summary>
        /// Creates an instance of a controller of the specified 'T' type and initializes it with the specified 'user'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a controller you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="uri"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateController<T>(this TestHelper helper, ClaimsPrincipal user, Uri uri, params object[] args) where T : ControllerBase
        {
            helper.MockConstructorArguments<T>(args);
            var context = helper.CreateControllerContext(user, uri);

            helper.BuildServiceProvider();
            var controller = helper.CreateInstance<T>();
            controller.ControllerContext = context;

            return controller;
        }

        /// <summary>
        /// Provides a quick way to create a ControllerContext with the specified user.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="uri"></param>
        /// <returns></returns>
        public static ControllerContext CreateControllerContext(this TestHelper helper, ClaimsPrincipal user, Uri uri = null)
        {
            return new ControllerContext()
            {
                HttpContext = helper.CreateHttpContext(user, uri)
            };
        }

        /// <summary>
        /// Creates a default pims configuration options.
        /// </summary>
        /// <returns></returns>
        public static IOptions<PimsOptions> CreateDefaultPimsOptions()
        {
            return Options.Create(new PimsOptions()
            {
                Project = CreateDefaultProjectOptions().Value
            });
        }

        /// <summary>
        /// Creates a default project configuration options.
        /// </summary>
        /// <returns></returns>
        public static IOptions<ProjectOptions> CreateDefaultProjectOptions()
        {
            return Options.Create(new ProjectOptions()
            {
                DraftFormat = "DRAFT-{0:00000}",
                NumberFormat = "SPP-{0:00000}",
                DraftWorkflows = new[] { "SUBMIT-DISPOSAL" }
            });
        }
        #endregion
    }
}
