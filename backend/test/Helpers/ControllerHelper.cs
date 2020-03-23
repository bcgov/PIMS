using System.Security.Claims;
using System.Linq;
using System;
using Pims.Core.Extensions;
using Moq;
using Microsoft.AspNetCore.Mvc;

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
        /// <param name="user"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateController<T>(this TestHelper helper, ClaimsPrincipal user, params object[] args) where T : ControllerBase
        {
            helper.MockConstructorArguments<T>(args);
            helper.AddSingleton(TestHelper.CreateMapper());

            helper.BuildServiceProvider();
            var controller = helper.CreateInstance<T>();
            controller.ControllerContext = CreateControllerContext(user);

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
                var gmake = gmock.MakeGenericType(carg.ParameterType);
                var mockObjectProp = gmock.GetCachedProperties().FirstOrDefault(p => p.Name == nameof(Mock.Object) && !p.PropertyType.IsGenericParameter) ?? throw new InvalidOperationException($"The mocked type '{type.Name}' was unable to determine the correct 'Object' property.");

                // If an 'args' type matches, use it for the mock.
                var arg = args.FirstOrDefault(a => a.GetType() == carg.ParameterType);
                var mock = arg != null ? Activator.CreateInstance(gmake, arg) : Activator.CreateInstance(gmake);
                helper.AddSingleton(gmake, mock);
                helper.AddSingleton(carg.ParameterType, mockObjectProp.GetValue(mock));
            }
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
        #endregion
    }
}
