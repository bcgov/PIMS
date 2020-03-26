using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ErrorController class.
        /// </summary>
        /// <param name="logger"></param>
        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Returns a json result with the error details.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [Produces("application/json")]
        public IActionResult Error()
        {
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            _logger.LogError(exceptionHandlerPathFeature.Error, "Unhandled error occured.");
            return new JsonResult(new { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}
