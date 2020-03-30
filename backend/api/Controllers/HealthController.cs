using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Annotations;
using Model = Pims.Api.Models.Health;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// HealthController class, provides endpoints to check the health of the api.
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/health")]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        #region Variables
        private readonly ILogger<HealthController> _logger;
        private readonly IWebHostEnvironment _environment;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instances of a HealthController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="environment"></param>
        /// <param name="logger"></param>
        public HealthController(IWebHostEnvironment environment, ILogger<HealthController> logger)
        {
            _logger = logger;
            _environment = environment;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Return environment information.
        /// </summary>
        /// <returns></returns>
        [HttpGet("env")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.EnvModel), 200)]
        [SwaggerOperation(Tags = new[] { "health" })]
        public IActionResult Environment()
        {
            return new JsonResult(new Model.EnvModel(_environment));
        }
        #endregion
    }
}
