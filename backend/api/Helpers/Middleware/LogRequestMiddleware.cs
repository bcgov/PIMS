using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Middleware
{
    /// <summary>
    /// LogRequestMiddleware class, provides a way to log requests inbound to the API.
    /// </summary>
    public class LogRequestMiddleware
    {
        #region Variables
        private readonly RequestDelegate _next;
        private readonly ILogger<LogRequestMiddleware> _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an LogRequestMiddleware class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="next"></param>
        /// <param name="logger"></param>
        public LogRequestMiddleware(RequestDelegate next, ILogger<LogRequestMiddleware> logger)
        {
            _next = next;
            _logger = logger;
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
            _logger.LogInformation($"Received HTTP Request {context.Request.Method} user:{context.User.GetDisplayName()} {context.Request.Scheme}://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}");

            await _next(context);
        }
        #endregion
    }
}
