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
            context.Request.Headers["device-id"] = "20317";
            return context;
        }
    }
}
