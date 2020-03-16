using System.IO;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Pims.Api.Test.Helpers
{
    public static class HttpContextHelper
    {
        /// <summary>
        /// Provides a quick way to create a new HttpContext and initialize it with the specified properties.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static DefaultHttpContext CreateHttpContext (ClaimsPrincipal user)
        {
            var context = new DefaultHttpContext ()
            {
                User = user
            };
            context.Request.Scheme="http";
            context.Request.Host=new HostString("localhost");
            context.Request.Path=new PathString("/test");
            context.Request.PathBase=new PathString("/");
            context.Request.Body=new MemoryStream();
            context.Request.QueryString=new QueryString("?");
            context.Request.Headers["device-id"] = "20317";
            return context;
        }
    }
}
