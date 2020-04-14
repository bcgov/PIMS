using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Api.Helpers.Middleware
{
    /// <summary>
    /// LogRequestMiddleware class, provides a way to log requests inbound to the API.
    /// </summary>
    public class LogRequestMiddleware
    {
        #region Variables
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<LogRequestMiddleware> _logger;
        private readonly JsonOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an LogRequestMiddleware class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="next"></param>
        /// <param name="env"></param>
        /// <param name="logger"></param>
        /// <param name="options"></param>
        public LogRequestMiddleware(RequestDelegate next, IWebHostEnvironment env, ILogger<LogRequestMiddleware> logger, IOptions<JsonOptions> options)
        {
            _next = next;
            _env = env;
            _logger = logger;
            _options = options.Value;
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
