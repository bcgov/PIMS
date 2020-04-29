using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly ToolOptions _config;
        private readonly IFactory _factory;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="optionsTool"></param>
        /// <param name="factory"></param>
        /// <param name="logger"></param>
        public Startup(IOptionsMonitor<ToolOptions> optionsTool, IFactory factory, ILogger<Startup> logger)
        {
            _config = optionsTool.CurrentValue;
            _logger = logger;
            _factory = factory;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run the console application.
        /// </summary>
        /// <param name="args"></param>
        /// <return></return>
        public async Task<int> Run(string[] args)
        {
            _logger.LogInformation("Keycloak Sync Started");

            var result = await _factory.SyncAsync();

            _logger.LogInformation("Keycloak Sync Stopping");

            return result;
        }
        #endregion
    }
}
