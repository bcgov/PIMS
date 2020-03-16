using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Pims.Api.Controllers
{
    /// <summary>
    /// HealthController class, provides endpoints to check the health of the api.
    /// </summary>
    [ApiController]
    [Route("/api/[controller]")]
    public class HealthController : ControllerBase
    {
        #region Variables
        private readonly ILogger<HealthController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instances of a HealthController class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        /// <param name="environment"></param>
        public HealthController(ILogger<HealthController> logger, IConfiguration configuration, IWebHostEnvironment environment)
        {
            _logger = logger;
            _configuration = configuration;
            _environment = environment;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Return environment information.
        /// </summary>
        /// <returns></returns>
        [HttpGet("/api/env")]
        public IActionResult Environment()
        {
            return new JsonResult(new
            {
                environment = _environment.EnvironmentName,
                    version = this.GetType().Assembly.GetName().Version.ToString(),
                    fileVersion = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyFileVersionAttribute>().Version,
                    informationalVersion = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion
            });
        }
        #endregion
    }
}
