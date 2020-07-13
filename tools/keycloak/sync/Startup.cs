using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly ISyncFactory _syncFactory;
        private readonly IRealmFactory _realmFactory;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="realmFactory"></param>
        /// <param name="syncFactory"></param>
        /// <param name="logger"></param>
        public Startup(IRealmFactory realmFactory, ISyncFactory syncFactory, ILogger<Startup> logger)
        {
            _realmFactory = realmFactory;
            _syncFactory = syncFactory;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run the console application.
        /// </summary>
        /// <param name="args"></param>
        /// <return></return>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Standard argument for console application.")]
        public async Task<int> Run(string[] args)
        {
            _logger.LogInformation("Keycloak Realm Factory Started");

            var result = await _realmFactory.InitAsync();

            _logger.LogInformation("Keycloak Realm Factory Stopping");

            _logger.LogInformation("Keycloak Sync Factory Started");

            result += await _syncFactory.SyncAsync();

            _logger.LogInformation("Keycloak Sync Factory Stopping");

            return result;
        }
        #endregion
    }
}
