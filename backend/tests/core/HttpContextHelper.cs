using System;
using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Moq;

namespace Pims.Core.Test
{
    public static class HttpContextHelper
    {
        /// <summary>
        /// Provides a quick way to create a new HttpContext and initialize it with the specified properties.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="uri"></param>
        /// <returns></returns>
        public static HttpContext CreateHttpContext(this TestHelper helper, ClaimsPrincipal user, Uri uri = null)
        {
            var request = new Mock<HttpRequest>();
            helper.AddSingleton(request);
            request.Setup(m => m.Scheme).Returns(uri?.Scheme ?? "http");
            request.Setup(m => m.Host).Returns(String.IsNullOrWhiteSpace(uri?.Host) ? new HostString("localhost") : new HostString(uri.Host));
            request.Setup(m => m.Path).Returns(String.IsNullOrWhiteSpace(uri?.AbsolutePath) ? new PathString("/test") : new PathString(uri.AbsolutePath));
            request.Setup(m => m.PathBase).Returns(new PathString("/"));
            request.Setup(m => m.Body).Returns(new MemoryStream());
            request.Setup(m => m.QueryString).Returns(String.IsNullOrWhiteSpace(uri?.Query) ? new QueryString("?") : new QueryString(uri.Query));

            var header = new Mock<IHeaderDictionary>();
            helper.AddSingleton(header);
            header.Setup(m => m["device-id"]).Returns("20317");
            header.Setup(m => m["X-RequestedWith"]).Returns("XMLHttpRequest");
            request.Setup(m => m.Headers).Returns(header.Object);

            var features = new Mock<IFeatureCollection>();
            helper.AddSingleton(features);
            features.Setup(m => m.Get<HttpRequest>()).Returns(request.Object);
            features.Setup(m => m.Get<ClaimsPrincipal>()).Returns(user);

            var context = new Mock<HttpContext>();
            context.Setup(m => m.Features).Returns(features.Object);
            context.Setup(m => m.Request).Returns(request.Object);
            context.Setup(m => m.RequestServices).Returns(helper.Provider);

            var contextAccess = new Mock<IHttpContextAccessor>();
            helper.AddSingleton(contextAccess);
            contextAccess.Setup(m => m.HttpContext).Returns(context.Object);

            return context.Object;
        }
    }
}
