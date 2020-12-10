using Pims.Core.Helpers;
using Pims.Dal;
using Pims.Dal.Security;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Security.Claims;

namespace Pims.Core.Test
{
    /// <summary>
    /// ServiceHelper static class, provides helper functions for TestHelper when interacting with services.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class ServiceHelper
    {
        #region Methods
        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with a user with the specified 'permission'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="permission"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, Permissions permission, params object[] args) where T : IService
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreateService<T>(user, args);
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with a user with the specified 'permission'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="dbName"></param>
        /// <param name="permission"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, string dbName, Permissions permission, params object[] args) where T : IService
        {
            var user = PrincipalHelper.CreateForPermission(permission);
            return helper.CreateService<T>(dbName, user, args);
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified 'user'.
        /// If the 'PimsContext' already has been added as a service it will use it, otherwise it will create a new random context.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, ClaimsPrincipal user, params object[] args) where T : IService
        {
            if (!helper.Services.Any(s => s.ServiceType == typeof(PimsContext)))
            {
                var dbName = StringHelper.Generate(10);
                return helper.CreateService<T>(helper.CreatePimsContext(dbName, user, false), args);
            }

            return helper.CreateService<T>(args);
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified 'user'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="dbName"></param>
        /// <param name="user"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, string dbName, ClaimsPrincipal user, params object[] args) where T : IService
        {
            return helper.CreateService<T>(helper.CreatePimsContext(dbName, user, false), args);
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified 'user'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="context"></param>
        /// <param name="args"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, PimsContext context, params object[] args) where T : IService
        {
            helper.MockConstructorArguments<T>(args);
            helper.AddSingleton(context);

            helper.BuildServiceProvider();
            var service = helper.CreateInstance<T>();

            return service;
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified arguments.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public static T CreateService<T>(this TestHelper helper, params object[] args) where T : IService
        {
            helper.MockConstructorArguments<T>(args);

            helper.BuildServiceProvider();
            var service = helper.CreateInstance<T>();

            return service;
        }

        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified arguments.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public static T Create<T>(this TestHelper helper, params object[] args) where T : class
        {
            helper.MockConstructorArguments<T>(args);
            helper.BuildServiceProvider();
            var service = helper.CreateInstance<T>();

            return service;
        }

        /// <summary>
        /// Creates an instance of an object of the specified 'T' type and initializes it with the specified arguments.
        /// Will use any 'args' passed in instead of generating defaults.
        /// This will add the new instance to the ServiceCollection, so that you can continue to configure your ServiceCollection before building it.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public static T Add<T>(this TestHelper helper, params object[] args) where T : class
        {
            var types = helper.MockConstructorArguments<T>(args);
            var con = typeof(T).GetConstructor(types.Select(t => t.Key).ToArray());
            var values = types.Select(t => t.Value).ToArray();
            var result = (T)con.Invoke(values);
            helper.AddSingleton(result);
            return result;
        }

        /// <summary>
        /// Creates an instance of an object of the specified 'T' type and initializes it with the specified arguments.
        /// Will use any 'args' passed in instead of generating defaults.
        /// This will add the new instance to the ServiceCollection, so that you can continue to configure your ServiceCollection before building it.
        /// </summary>
        /// <typeparam name="TService"></typeparam>
        /// <typeparam name="TImplementation"></typeparam>
        /// <param name="helper"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        public static TService Add<TService, TImplementation>(this TestHelper helper, params object[] args)
            where TService : class
            where TImplementation : class, TService
        {
            var types = helper.MockConstructorArguments<TImplementation>(args);
            var con = typeof(TImplementation).GetConstructor(types.Select(t => t.Key).ToArray());
            var result = (TImplementation)con.Invoke(types.Select(t => t.Value).ToArray());
            helper.AddSingleton<TService, TImplementation>(result);
            return result;
        }
        #endregion
    }
}
