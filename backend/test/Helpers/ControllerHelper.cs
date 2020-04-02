using System.Security.Claims;
using System.Linq;
using System;
using Pims.Core.Extensions;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Pims.Dal.Security;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// ControllerHelper static class, provides helper functions for setting up tests for controllers.
    /// </summary>
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
            helper.AddSingleton(TestHelper.CreateMapper());
            var context = helper.CreateControllerContext(user, uri);

            helper.BuildServiceProvider();
            var controller = helper.CreateInstance<T>();
            controller.ControllerContext = context;

            return controller;
        }

        /// <summary>
        /// Mock all constructor arguments of the specified type of 'T'.
        /// Will only work with a type that has a single constructor.
        /// Will use any 'args' passed in instead of generating defaults.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        public static void MockConstructorArguments<T>(this TestHelper helper, params object[] args)
        {
            var type = typeof(T);
            var constructors = type.GetCachedConstructors();
            var ci = constructors.SingleOrDefault() ?? throw new ArgumentException($"The type '{type.Name}' has more than one constructor.");

            var gmock = typeof(Mock<>);
            var cargs = ci.GetParameters();
            foreach (var carg in cargs)
            {
                if (helper.Services.Any(s => s.ServiceType == carg.ParameterType)) continue;

                // If an 'args' type matches, use it for the mock.
                var arg = args.FirstOrDefault(a => a.GetType() == carg.ParameterType);
                if (arg == null) arg = args.FirstOrDefault(a => carg.ParameterType.IsAssignableFrom(a.GetType()));
                if (arg != null)
                {
                    // Add the supplied argument to services.
                    helper.AddSingleton(carg.ParameterType, arg);
                    continue;
                }

                var gmake = gmock.MakeGenericType(carg.ParameterType);
                var mockObjectProp = gmock.GetCachedProperties().FirstOrDefault(p => p.Name == nameof(Mock.Object) && !p.PropertyType.IsGenericParameter) ?? throw new InvalidOperationException($"The mocked type '{type.Name}' was unable to determine the correct 'Object' property.");

                // Create a Mock and add it and the Object to services.
                var mock = Activator.CreateInstance(gmake);
                helper.AddSingleton(gmake, mock);
                helper.AddSingleton(carg.ParameterType, mockObjectProp.GetValue(mock));
            }
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
        #endregion
    }
}
