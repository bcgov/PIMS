using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Pims.Api.Helpers.Exceptions;
using Pims.Core.Exceptions;
using Pims.Dal.Exceptions;

namespace Pims.Api.Helpers.Middleware
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
                await HandleExceptionAsync(context, ex);
            }
        }

        /// <summary>
        /// Handle the exception by returning an appropriate error message depending on type and environment.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "An unhandled error has occurred.";
            string details = null;

            if (ex is SecurityTokenException)
            {
                code = HttpStatusCode.Unauthorized;
                message = "The authentication token is invalid.";
            }
            else if (ex is SecurityTokenValidationException)
            {
                code = HttpStatusCode.Unauthorized;
                message = "The authentication token is invalid.";
            }
            else if (ex is SecurityTokenExpiredException)
            {
                code = HttpStatusCode.Unauthorized;
                message = "The authentication token has expired.";
            }
            else if (ex is SecurityTokenNotYetValidException)
            {
                code = HttpStatusCode.Unauthorized;
                message = "The authentication token not yet valid.";
            }
            else if (ex is DbUpdateConcurrencyException)
            {
                code = HttpStatusCode.BadRequest;
                message = "Data may have been modified or deleted since item was loaded.";

                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else if (ex is DbUpdateException)
            {
                code = HttpStatusCode.BadRequest;
                message = "An error occurred while updating this item.";

                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else if (ex is KeyNotFoundException)
            {
                code = HttpStatusCode.BadRequest;
                message = "Item does not exist.";

                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else if (ex is RowVersionMissingException)
            {
                code = HttpStatusCode.BadRequest;
                message = "Item cannot be updated without a row version.";

                _logger.LogDebug(ex, "Middleware caught unhandled exception.");
            }
            else if (ex is NotAuthorizedException)
            {
                code = HttpStatusCode.Forbidden;
                message = "User is not authorized to perform this action.";

                _logger.LogWarning(ex, ex.Message);
            }
            else if (ex is Core.Exceptions.ConfigurationException)
            {
                code = HttpStatusCode.InternalServerError;
                message = "Application configuration details invalid or missing.";

                _logger.LogError(ex, ex.Message);
            }
            else if (ex is BadRequestException || ex is InvalidOperationException)
            {
                code = HttpStatusCode.BadRequest;
                message = ex.Message;
            }
            else if (ex is ApiHttpRequestException)
            {
                var exception = ex as ApiHttpRequestException;
                code = exception.StatusCode;
                message = ex.Message;

                try
                {
                    using var responseStream = await exception?.Response.Content.ReadAsStreamAsync();
                    responseStream.Position = 0;
                    using var readStream = new StreamReader(responseStream, Encoding.UTF8);
                    details = readStream.ReadToEnd(); // TODO: Rewrite this logic.
                    _logger.LogError(ex, details);
                }
                catch (Exception streamEx)
                {
                    // Ignore for now.
                    _logger.LogError(streamEx, $"Failed to read the {nameof(ApiHttpRequestException)} error stream.");
                }
            }
            else if (ex is HttpClientRequestException || ex is ProxyRequestException)
            {
                var exception = ex as HttpClientRequestException;
                code = exception.StatusCode;
                message = ex.Message;

                try
                {
                    using var responseStream = await exception?.Response.Content.ReadAsStreamAsync();
                    responseStream.Position = 0;
                    using var readStream = new StreamReader(responseStream, Encoding.UTF8);
                    details = readStream.ReadToEnd(); // TODO: Rewrite this logic.
                    _logger.LogError(ex, details);
                }
                catch (Exception streamEx)
                {
                    // Ignore for now.
                    _logger.LogError(streamEx, $"Failed to read the {nameof(HttpClientRequestException)} error stream.");
                }
            }
            else
            {
                _logger.LogError(ex, "Middleware caught unhandled exception.");
            }

            if (!context.Response.HasStarted)
            {
                var is_dev = _env.IsDevelopment();
                var result = JsonSerializer.Serialize(new Models.ErrorResponseModel(_env, ex, message, details), _options.JsonSerializerOptions);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code;
                await context.Response.WriteAsync(result);
            }
            else
            {
                // Had to do this because odd errors were occurring when bearer tokens were failing.
                await context.Response.WriteAsync(string.Empty);
            }
        }
        #endregion
    }
}
