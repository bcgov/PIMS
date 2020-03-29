using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Xunit;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// PimsAssert static class, provides extension methods for asserting.
    /// </summary>
    public static class PimsAssert
    {
        /// <summary>
        /// Assert that the specified 'attribute' contains the specified 'permissions'.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="permissions"></param>
        public static void HasPermissions(this HasPermissionAttribute attribute, params Permissions[] permissions)
        {
            Assert.Equal(permissions.Select(p => (object)p).ToArray(), attribute.Arguments);
        }

        /// <summary>
        /// Assert that the route template matches the specified 'template'.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="template"></param>
        public static void HasTemplate(this RouteAttribute attribute, string template)
        {
            Assert.Equal(template, attribute.Template);
        }

        /// <summary>
        /// Assert that the HTTP method template matches the specified 'template'.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="template"></param>
        public static void HasTemplate(this HttpMethodAttribute attribute, string template = null)
        {
            if (template == null)
                Assert.Null(attribute.Template);
            else
                Assert.Equal(template, attribute.Template);
        }

        /// <summary>
        /// Assert the specified 'controller' has the the authorize attribute.
        /// </summary>
        /// <param name="controller"></param>
        public static void HasAuthorize(this Type controller)
        {
            var authorize = controller.GetCustomAttribute<AuthorizeAttribute>();
            Assert.NotNull(authorize);
        }

        /// <summary>
        /// Assert that the specified 'controller' has the specified 'permissions'.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="permissions"></param>
        public static void HasPermissions(this Type controller, params Permissions[] permissions)
        {
            var attribute = controller?.GetCustomAttribute<HasPermissionAttribute>();
            Assert.NotNull(attribute);
            attribute?.HasPermissions(permissions);
        }

        /// <summary>
        /// Assert the specified 'controller' has the specified route 'template'.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="template"></param>
        public static void HasRoute(this Type controller, string template)
        {
            var routes = controller.GetCustomAttributes<RouteAttribute>();
            Assert.NotEmpty(routes);
            Assert.Contains(routes, r => template == null ? r.Template == null : r.Template == template);
        }

        /// <summary>
        /// Assert the specified 'endpoint' has the specified method 'template'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="template"></param>
        public static void HasMethod(this MethodInfo endpoint, HttpMethod method, string template)
        {
            HttpMethodAttribute attribute = method switch
            {
                HttpMethod.Post => endpoint.GetCustomAttribute<HttpPostAttribute>(),
                HttpMethod.Put => endpoint.GetCustomAttribute<HttpPutAttribute>(),
                HttpMethod.Delete => endpoint.GetCustomAttribute<HttpDeleteAttribute>(),
                HttpMethod.Get => endpoint.GetCustomAttribute<HttpGetAttribute>(),
                _ => endpoint.GetCustomAttribute<HttpGetAttribute>()
            };
            Assert.NotNull(attribute);
            attribute.HasTemplate(template);
        }

        /// <summary>
        /// Assert the specified 'endpoint' has the specified method 'template'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="template"></param>
        public static void HasGet(this MethodInfo endpoint, string template = null)
        {
            endpoint.HasMethod(HttpMethod.Get, template);
        }

        /// <summary>
        /// Assert the specified 'endpoint' has the specified method 'template'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="template"></param>
        public static void HasPost(this MethodInfo endpoint, string template = null)
        {
            endpoint.HasMethod(HttpMethod.Post, template);
        }

        /// <summary>
        /// Assert the specified 'endpoint' has the specified method 'template'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="template"></param>
        public static void HasPut(this MethodInfo endpoint, string template = null)
        {
            endpoint.HasMethod(HttpMethod.Put, template);
        }

        /// <summary>
        /// Assert the specified 'endpoint' has the specified method 'template'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="template"></param>
        public static void HasDelete(this MethodInfo endpoint, string template = null)
        {
            endpoint.HasMethod(HttpMethod.Delete, template);
        }

        /// <summary>
        /// Assert that the specified 'endpoint' has the specified 'permissions'.
        /// </summary>
        /// <param name="endpoint"></param>
        /// <param name="permissions"></param>
        public static void HasPermissions(this MethodInfo endpoint, params Permissions[] permissions)
        {
            var attribute = endpoint?.GetCustomAttribute<HasPermissionAttribute>();
            Assert.NotNull(attribute);
            attribute?.HasPermissions(permissions);
        }
    }
}
