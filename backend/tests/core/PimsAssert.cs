using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Pims.Api.Policies;
using Pims.Core.Comparers;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection;
using Xunit;

namespace Pims.Core.Test
{
    /// <summary>
    /// PimsAssert static class, provides extension methods for asserting.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class PimsAssert
    {
        /// <summary>
        /// Assert that the specified 'attribute' contains the specified 'permissions'.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="permissions"></param>
        public static void HasPermissions(this HasPermissionAttribute attribute, params Permissions[] permissions)
        {
            var attr = attribute.Arguments.First();
            if (attr is Permissions[] aperms)
                Assert.Equal(permissions.Select(p => p).ToArray(), aperms);
            else if (attr is Permissions aperm)
                Assert.Equal(permissions.Select(p => p).ToArray(), new Permissions[] { aperm });
            else
                Assert.True(false, "Invalid filter argument type");
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
        /// Assert the specified 'controller' has the specified 'version'.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="version"></param>
        public static void HasApiVersion(this Type controller, params string[] versions)
        {
            var attrs = controller.GetCustomAttributes<ApiVersionAttribute>();
            Assert.NotEmpty(attrs);
            Assert.Contains(attrs, a => versions.All(v => a.Versions.Any(av => av.ToString() == v)));
        }

        /// <summary>
        /// Assert the specified 'controller' has the specified 'areaName'.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="areaName"></param>
        public static void HasArea(this Type controller, string areaName)
        {
            var attr = controller.GetCustomAttribute<AreaAttribute>();
            Assert.NotNull(attr);
            Assert.Equal(attr.RouteValue, areaName);
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

        /// <summary>
        /// Does a deep compare of the two objects public properties.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="expected"></param>
        /// <param name="actual"></param>
        public static void DeepPropertyEqual<T>(T expected, T actual)
        {
            Assert.Equal(expected, actual, new DeepPropertyCompare<T>());
        }

        /// <summary>
        /// Does a shallow compare of the two objects public properties.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="expected"></param>
        /// <param name="actual"></param>
        public static void ShallowPropertyEqual<T>(T expected, T actual)
        {
            Assert.Equal(expected, actual, new ShallowPropertyCompare<T>());
        }

        /// <summary>
        /// Check if the specified 'obj' is of the specified Paged[T] type.
        /// Use this method to verify anonymous types returned from endpoints.
        /// The reason anonymous types are returned is because serialization will return an array if we simply return the paged object itself.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Paged<T> IsPaged<T>(object obj)
        {
            var type = obj.GetType();
            var itemsProp = type.GetProperty("Items");
            if (itemsProp == null) Assert.True(false, $"The object is not of the specified type '{typeof(Paged<T>).Name}'.");

            var items = itemsProp.GetValue(obj) as IEnumerable<T>;
            if (items == null) Assert.True(false, $"The object is not of the specified type '{typeof(Paged<T>).Name}'.");

            var pageProp = type.GetProperty("Page");
            var page = (int)pageProp.GetValue(obj);

            var quantityProp = type.GetProperty("Quantity");
            var quantity = (int)quantityProp.GetValue(obj);

            var totalProp = type.GetProperty("Total");
            var total = (int)totalProp.GetValue(obj);

            return new Paged<T>(items, page, quantity, total);

        }
    }
}
