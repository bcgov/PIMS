using Pims.Dal;
using Pims.Dal.Security;
using System.Security.Claims;

namespace Pims.Core.Test
{
    public static class ServiceHelper
    {
        #region Methods
        /// <summary>
        /// Creates an instance of a service of the specified 'T' type and initializes it with a user with the specified 'permission'.
        /// Will use any 'args' passed in instead of generating defaults.
        /// Once you create a service you can no longer add to the services collection.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="user"></param>
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
        /// Creates an instance of a service of the specified 'T' type and initializes it with the specified 'user'.
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
            return helper.CreateService<T>(helper.CreatePimsContext(user, false));
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
            helper.AddSingleton(TestHelper.CreateMapper());
            helper.AddSingleton(context);

            helper.BuildServiceProvider();
            var service = helper.CreateInstance<T>();

            return service;
        }
        #endregion
    }
}
