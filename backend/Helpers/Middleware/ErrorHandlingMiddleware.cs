using System.Net;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Pims.Api.Helpers.Extensions;

namespace backend.Helpers.Middleware
{
    /// <summary>
    /// ErrorHandlingMidleware class, provides a way to catch and handle unhandled errors in a generic way.
    /// </summary>
    public class ErrorHandlingMiddleware
    {
        #region Variables
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly JsonOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an ErrorHandlingMiddleware class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="next"></param>
        /// <param name="env"></param>
        /// <param name="logger"></param>
        /// <param name="options"></param>
        public ErrorHandlingMiddleware(RequestDelegate next, IWebHostEnvironment env, ILogger<ErrorHandlingMiddleware> logger, IOptions<JsonOptions> options)
        {
            _next = next;
            _env = env;
            _logger = logger;
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Handle the exception if one occurs.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsnyc(context, ex);
            }
        }

        /// <summary>
        /// Handle the exception by returning an appropriate error message depending on type and environment.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        private Task HandleExceptionAsnyc(HttpContext context, Exception ex)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "An unhandled error has occured.";

            if (ex is DbUpdateConcurrencyException)
            {
                code = HttpStatusCode.BadRequest;
                message = "Data may have been modified or deleted since item was loaded.";
                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else if (ex is DbUpdateException)
            {
                code = HttpStatusCode.BadRequest;
                message = "An error occured while updating this item.";
                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else
            {
                _logger.LogError(ex, "Middleware caught unhandled exception.");
            }

            var result = JsonSerializer.Serialize(new
            {
                Error = _env.IsDevelopment() ? ex.Message : message,
                Type = ex.GetType().Name,
                StackTrace = _env.IsDevelopment() ? ex.StackTrace : null,
                Details = _env.IsDevelopment() ? ex.GetAllMessages() : null // TODO: handle inner exception messages.
            }, _options.JsonSerializerOptions);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
        #endregion
    }
}
