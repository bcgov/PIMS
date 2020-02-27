using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// ErrorController class, provides endpoints to handle exception errors.
    /// </summary>
    public class ErrorController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ErrorController> _logger;
        private readonly IConfiguration _configuration;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ErrorController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        public ErrorController(ILogger<ErrorController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Returns a json result with the error details.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public IActionResult Error()
        {
            // TODO: Log errors and only return appropriate errors for production.
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            // if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
            // {
            //     ExceptionMessage = "File error thrown";
            // }
            // if (exceptionHandlerPathFeature?.Path == "/index")
            // {
            //     ExceptionMessage += " from home page";
            // }
            return new JsonResult(new { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}
