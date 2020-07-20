using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Middleware
{
    /// <summary>
    /// ResponseTimeMiddleware class, provides a way to include the response time in the header.
    /// </summary>
    public class ResponseTimeMiddleware
    {
        #region Variables
        private readonly RequestDelegate _next;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an ResponseTimeMiddleware class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="next"></param>
        public ResponseTimeMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Add a log message for the request.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext context)
        {
            var watch = Stopwatch.StartNew();

            context.Response.OnStarting(() =>
            {
                watch.Stop();
                context.Response.Headers["X-Response-Time-ms"] = $"{watch.ElapsedMilliseconds}";
                return Task.CompletedTask;
            });

            await _next(context);
        }
        #endregion
    }
}
