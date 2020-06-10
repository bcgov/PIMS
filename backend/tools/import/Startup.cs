using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly ToolOptions _config;
        private readonly IImporter _importer;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="optionsTool"></param>
        /// <param name="importer"></param>
        /// <param name="logger"></param>
        public Startup(IOptionsMonitor<ToolOptions> optionsTool, IImporter importer, ILogger<Startup> logger)
        {
            _config = optionsTool.CurrentValue;
            _logger = logger;
            _importer = importer;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run the console application.
        /// </summary>
        /// <param name="args"></param>
        /// <return></return>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Not implemented yet.")]
        public async Task<int> Run(string[] args)
        {
            _logger.LogInformation("Import Started");

            var file = new FileInfo(_config.Import.File);
            _logger.LogInformation($"Import file: {file}");

            var result = await _importer.ImportAsync(file);

            _logger.LogInformation("Import Stopping");

            return result;
        }
        #endregion
    }
}
